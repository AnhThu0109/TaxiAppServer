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
    const io = req.app.io;
    //console.log(io)
    try {
    //const nearbyDrivers =  await driverController.nearbyDriver(booking.longitude,booking.latitude);
     //await sendRequestToDrivers(booking.longitude,booking.latitude)
     const drivers = await driverController.nearbyDriver(booking.longitude,booking.latitude);
     const longitude = booking.longitude;
     const latitude = booking.latitude;
     /*drivers.forEach(driver => {
        io.to(driver.socketId).emit('rideRequest', {
            requestId: 'uniqueRequestId', // generate a unique request ID
            location: {longitude, latitude },
        });
    });*/
    for (const driver of drivers) {
        try {
            io.on('driver_acc',  async (response) => {
                console.log('Driver:', io.id);
                // handle booking
               
                console.log(response);
              });
            const response = await sendRequestToDrivers(driver,booking, io);
            console.log(response);
            // Nếu tài xế chấp nhận, trả về kết quả và thông tin tài xế
            /*
            io.to(driver.socketId).emit('rideRequest', {
                requestId: 'uniqueRequestId',
                location: { longitude, latitude },
              });
          
              // Lắng nghe phản hồi từ tài xế
              console.log("Đang chờ phản hồi từ tài xế" + driver.id)
              //handleDriverConnection(io);
          
              io.on('driver_accepted', (response) => {
                console.log('Driver accepted:', io.id);
                // handle booking
                console.log(response);
                if (response.accepted) {
                    
                    res.status(200).json({
                        message: 'Ride request accepted',
                        driverId: driver.id,
                        
                    });
                }
                
              });*/
            
        } catch (error) {
            console.error(`Error sending request to Driver ${driver.id}:`, error.message);
            // Nếu có lỗi, tiếp tục với tài xế tiếp theo
        }
    }

    } catch (err){
        console.error('Error sending ride request:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
  

})
/*
const sendRequestToDrivers = async (longitude, latitude) => {
    try {
        const drivers = await driverController.nearbyDriver(longitude, latitude);

        // Send request to each driver
        drivers.forEach(driver => {
            io.to(driver.socketId).emit('rideRequest', {
                requestId: 'uniqueRequestId', // generate a unique request ID
                location: { longitude, latitude },
            });
        });

    } catch (err) {
        console.error('Error sending ride request:', err.message);
    }
};*/
module.exports = router;