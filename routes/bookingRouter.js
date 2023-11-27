const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const driverController = require('../controllers/driverController');
let models = require('../models');
let Driver = models.Drivers;
const auth = require('../middleware/auth');
const { sendRequestToDrivers } = require('../socket/server');

router.get('/', auth,(req, res, next) => {
    
    bookingController
        .getAll()
        .then(data => {
            res.send(data);
        })
        .catch(error => next(error));

});
router.get('/admin/:id', auth,(req, res, next) => {
    
    bookingController
        .getByAdminId(req.params.id)
        .then(data => {
            res.send(data);
        })
        .catch(error => next(error));

});
router.get('/:id', auth,(req, res, next) => {
    
    bookingController
        .getByBookingId(req.params.id)
        .then(data => {
            res.send(data);
        })
        .catch(error => next(error));

});
router.post('/bookRide', async (req, res, next) => {
    let booking = req.body.data;
    const [pick_longitude, pick_latitude] = req.body.data.pickupLocation;
    const [des_longitude, des_latitude] = req.body.data.destination;
    booking.pickupLocation = {
        type: 'Point',
        coordinates: [pick_longitude, pick_latitude],
      };
    booking.destination = {
        type: 'Point',
        coordinates: [des_longitude, des_latitude],
      };
    const io = req.app.io;

    try {
        //lưu booking xuống database
        const savedBooking = await bookingController.save(booking);
        console.log('Pickup Location:', savedBooking.pickupLocation);
        console.log('Pickup log lati:', booking.pickupLocation);
        //Tìm tài xế gần vị trí khách hàng
        const drivers = await driverController.NearByDrivers(pick_longitude, pick_latitude);
        //gửi lần lượt booking tới từng tài xế
        for (const driver of drivers) {
            try {
                const driverId = await sendRequestToDrivers(driver, booking, io);

                if (driverId) {
                    console.log("id tài xế nhận cuốc xe: " + driverId);
                    const updateBooking = {
                        id: savedBooking.id,
                        status: 3, //tài xế đã nhận cuốc xe
                        driverId: driverId
                    }
                    await bookingController.updateDriverAccepted(updateBooking);
                    const driver_accepted = await driverController.findDriverById(driverId);
                    
                    return res.status(201).send(driver_accepted);

                }

            } catch (error) {
                console.error(`Error sending request to Driver ${driver.id}:`, error.message);
                // Nếu có lỗi, tiếp tục với tài xế tiếp theo
            }
        }
        res.status(404).send({ message: 'Không tìm thấy tài xế!' });
    } catch (err) {
        console.error('Error sending ride request:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }    

})

module.exports = router;