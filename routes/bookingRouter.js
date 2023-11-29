const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const locationController = require("../controllers/locationController");
const driverController = require("../controllers/driverController");
let models = require("../models");
let Driver = models.Drivers;
const auth = require("../middleware/auth");
const { sendRequestToDrivers } = require("../socket/server");

router.get("/", auth, (req, res, next) => {
  bookingController
    .getAll()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => next(error));
});

router.get("/admin/:id", auth, (req, res, next) => {
  bookingController
    .getByAdminId(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => next(error));
});

router.get("/driver/:id", auth, (req, res, next) => {
  bookingController
    .getByDriverId(req.params.id)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => next(error));
});

 /*   try {
        //lưu booking xuống database
        
        //Tìm tài xế gần vị trí khách hàng
        const drivers = await driverController.NearByDrivers(pick_longitude, pick_latitude,booking.carType, booking.serviceId);
        booking.id = savedBooking.id;
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
                    io.to(booking.socketId).emit('bookingAccept', {
                        
                        driverInfo: driver_accepted
                         
                      });
                  
                    
                    return res.status(201).send(driver_accepted);*/


router.post("/bookRide", async (req, res, next) => {
    let booking = req.body.data;
    const pickupLocationId = req.body.data.pickupLocationId;

    const pickupLocationDetails = await locationController.getLocationById(
        pickupLocationId
    );

    const [pick_longitude, pick_latitude] = [
        pickupLocationDetails.longitude,
        pickupLocationDetails.latitude,
    ];

    booking.pickupLocation = {
        type: "Point",
        coordinates: [pick_longitude, pick_latitude],
    };

    const io = req.app.io;

    try {
        //lưu booking xuống database
        const savedBooking = await bookingController.save(booking);
        console.log("Pickup Location:", savedBooking.pickupLocation);
        console.log("Pickup log lati:", booking.pickupLocation);
        //Tìm tài xế gần vị trí khách hàng
        const drivers = await driverController.NearByDrivers(
            pick_longitude,
            pick_latitude,
            booking.carType,
            booking.serviceId
        );
        let driverAccepted = false;
        //gửi lần lượt booking tới từng tài xế
      for (const driver of drivers) {
        try {
          const driverId = await sendRequestToDrivers(driver, booking, io);

          if (driverId) {
            console.log("id tài xế nhận cuốc xe: " + driverId);
            const updateBooking = {
              id: savedBooking.id,
              status: 3, //tài xế đã nhận cuốc xe
              driverId: driverId,
            };
            await bookingController.updateDriverAccepted(updateBooking);
            const driver_accepted = await driverController.findDriverById(
              driverId
            );
            io.to(booking.socketId).emit('bookingAccept', {

              driverInfo: driver_accepted

            });
            return res.status(200).send(driver_accepted);
          }

        } catch (err) {
          console.error('Error sending ride request:', err.message);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }
      const updateBooking = {
        id: savedBooking.id,
        status: 2, // No driver accepted
      };
      await bookingController.updateBookingStatus(updateBooking);
      res.status(404).send({
        message: 'Không tìm thấy tài xế!',
        data: savedBooking
      });
    } catch (err) {
      console.error("Error sending ride request:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
        
    }


});

router.post("/rebook/:id", async (req, res, next) => {
  const bookingInfo = await bookingController.getByBookingId(req.params.id);

  const [pick_longitude, pick_latitude] = [
    bookingInfo.pickupLocation.longitude,
    bookingInfo.pickupLocation.latitude,
  ];
  let booking = {
    sum: Number(bookingInfo.Bill.sum),
    pickupLocation: {
      type: "Point",
      coordinates: [pick_longitude, pick_latitude],
    },
  };

  const io = req.app.io;

  try {
    //Cập nhật lại status là On Progress
    let updateBooking = {
      id: bookingInfo.id,
      status: 1, // No driver accepted
    };
    await bookingController.updateBookingStatus(updateBooking);
    //Tìm tài xế gần vị trí khách hàng
    const drivers = await driverController.NearByDrivers(
      pick_longitude,
      pick_latitude
    );
    let driverAccepted = false;

    //gửi lần lượt booking tới từng tài xế
    for (const driver of drivers) {
      try {
        const driverId = await sendRequestToDrivers(driver, booking, io);

        if (driverId) {
          console.log("id tài xế nhận cuốc xe: " + driverId);
          updateBooking = {
            id: bookingInfo.id,
            status: 3, //tài xế đã nhận cuốc xe
            driverId: driverId,
          };
          await bookingController.updateDriverAccepted(updateBooking);
          const driver_accepted = await driverController.findDriverById(
            driverId
          );
          return res.status(200).send(driver_accepted);
        }
      } catch (error) {
        console.error(
          `Error sending request to Driver ${driver.id}:`,
          error.message
        );
        // Nếu có lỗi, tiếp tục với tài xế tiếp theo
      }
    }
    // Nếu không có driver nhận cuốc
    updateBooking = {
      id: bookingInfo.id,
      status: 2, // No driver accepted
    };
    await bookingController.updateBookingStatus(updateBooking);

    if (!driverAccepted) {
      res.status(404).send({ message: "Không tìm thấy tài xế!" });
    }
  } catch (err) {
    console.error("Error sending ride request:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/customer/:id", auth, (req, res, next) => {
    bookingController
      .getByCustomerId(req.params.id)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => next(error));
  });
  
router.get("/:id", auth, (req, res, next) => {
    bookingController
      .getByBookingId(req.params.id)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => next(error));
  });
module.exports = router;
