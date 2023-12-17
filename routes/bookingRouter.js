const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const locationController = require("../controllers/locationController");
const driverController = require("../controllers/driverController");
const carController = require("../controllers/carController");
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

router.post("/bookRide", async (req, res, next) => {
  let booking = req.body.data;
  let bookingId = req.body.bookingId;
  const pickupLocationId = req.body.data.pickupLocationId;
  console.log(pickupLocationId);
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
    let savedBooking;
    if (!bookingId) {
      //lưu booking xuống database
      const savebooking = await bookingController.save(booking);
      savedBooking = await bookingController.getByBookingId(savebooking.id);
    } else {
      //Tìm booking đã lưu xuống database
      savedBooking = await bookingController.getByBookingId(bookingId);

      //Update status to on progress
      await bookingController.updateBookingForm(bookingId, {status: 2}); //2: Đang tìm tài xế
    }

    //Tìm tài xế gần vị trí khách hàng theo loại xe và dịch vụ yêu cầu
    const drivers = await driverController.NearByDrivers(
      pick_longitude,
      pick_latitude,
      Number(booking.carType),
      Number(booking.serviceId )
    );
    //console.log()
    drivers.map((d) => console.log(d.toJSON()));

    //gửi lần lượt booking tới từng tài xế
    for (const driver of drivers) {
      try {
        const driverId = await sendRequestToDrivers(driver, savedBooking, io);

        if (driverId) {
          console.log("id tài xế nhận cuốc xe: " + driverId);
          const car = await carController.getByDriverId(driverId);
          const updateBooking = {
            id: savedBooking.id,
            status: 3, //tài xế đã nhận cuốc xe
            driverId: driverId,
            carId: car.id
          };

          await bookingController.updateDriverAccepted(updateBooking);
          //Lấy thông tin tài xế nhận cuốc xe
          const driver_accepted = await driverController.findDriverById(
            driverId
          );
          //gửi thông tin tài xế cho admin qua socket.io
          io.to(booking.socketId).emit("bookingAccept", {
            driverInfo: driver_accepted,
          });
          return res
            .status(200)
            .send({ driver_accepted, bookingId: savedBooking.id });
        }
      } catch (err) {
        console.error("Error sending ride request:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
    const updateBooking = {
      id: savedBooking.id,
      status: 3, // No driver accepted
    };
    await bookingController.updateBookingStatus(updateBooking);
    io.emit("bookingReject", {
      message: "Không tìm thấy tài xế!",
      data: savedBooking,
    });
    return res.status(404).send({
      message: "Không tìm thấy tài xế!",
      data: savedBooking,
    });
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

router.put("/:id/update", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBookingForm = req.body; 

    const result = await bookingController.updateBookingForm(id, updatedBookingForm);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating booking form:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
