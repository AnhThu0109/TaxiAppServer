var distance = require('google-distance-matrix');

let models = require('../models');
let Driver = models.Drivers;

const driverLocationController = require('../controllers/driverLocationController');
const driverController = require('../controllers/driverController');
const bookingController = require('../controllers/bookingController');



let drivers = [];
let drivers_sending = [];
let drivers_accepted = [];

const handleDriverConnection = (socket) => {
  console.log('Socket id online:', socket.id);

  socket.on('driver_connect', async (driver) => {
    console.log(driver.id);
    console.log("Driver available, socket id: " + socket.id)
    driver.socketId = socket.id;

    try {
      await driverController.update(driver, socket)
      socket.emit('updateSuccess', { msg: 'Update successful' });
    } catch (err) {
      console.error('Error updating user:', err.message);
      //socket.emit('Error',{ message: err.message })
    }

  })


  socket.on('driver_rejected', () => {
    console.log('Driver rejected:', socket.id);
    // handle next driver
  });

  //tài xế nhận cuốc xe
  socket.on('driver_accepted:' + socket.id, async(booking) => {
    console.log('Driver accepted:', socket.id);
    //console.log('booking:' + booking.status);
    console.log('driverId:' + booking.driverId);
    // handle booking
    const driverId = booking.driverId;
    //const socketId = socket.id;
    drivers_accepted.push(driverId);
    booking.status = 3;
    const updateBooking = await bookingController.updateDriverAccepted(booking);
    socket.emit('booking_status', {
      bookingId: booking.id,
      status: updateBooking.BookingStatusId
    });
  });

  //tài xế đến
  socket.on('driver_arrived:' + socket.id, async (booking) => {
    console.log('Driver arrived:', socket.id);
    booking.Trip_Start_Time = new Date();
    console.log('driverId:' + booking.driverId);
    // handle booking
    booking.status = 4;
    const updateBooking = await bookingController.updateDriverAccepted(booking);
    console.log("status:" + updateBooking)
    socket.emit('booking_status', {
      bookingId: booking.id,
      status: updateBooking.BookingStatusId
    });

  });

  //hoàn thành chuyến
  socket.on('driver_completed:' + socket.id, async (booking) => {
    console.log('Driver completed:', socket.id);
    // handle booking
    booking.Trip_End_Time = new Date();
    booking.status = 7;
    const updateBooking = await bookingController.updateDriverAccepted(booking);
    console.log("status:" + updateBooking)
    socket.emit('booking_status', {
      bookingId: booking.id,
      status: updateBooking.BookingStatusId
    });

  });

  socket.on('disconnect:' + socket.id, async (driver) => {
    console.log('Driver disconnected:', socket.id);
    driver.status = 'disconnect';
    try {
      await driverController.update(driver)

    } catch (err) {
      console.error('Error updating user:', err.message);
      //socket.emit('Error',{ message: err.message })
    }


  });
  //web tổng đài viên
  socket.on('check_location', async (booking) => {
    console.log('socketid:', socket.id);
    const driver_accepted = await driverController.findDriverById(
      booking.driverId
    );
    socket.emit('driver_location', {
      driver_location: driver_accepted.location.coordinates

    });

  });
}

async function sendRequestToDrivers(driver, booking, io) {
  try {
    //console.log(booking);
    /*const longitude = booking.pickupLocation.coordinates[0];
    const latitude = booking.pickupLocation.coordinates[1];*/
    const longitude = booking.pickupLocation.longitude;
    const latitude = booking.pickupLocation.latitude;
    const locationName = booking.pickupLocation.locationName;
    // if (drivers_sending.includes(driver.id)) {
    //   console.log("đang chờ tài xế " + driver.id + "phản hồi cuốc xe khác")
    //   return null;
    // }
    // else {
      io.to(driver.socketId).emit('rideRequest', {
        requestId: 'uniqueRequestId',
        pickup_location: { longitude, latitude, locationName },
        bookingInfo: booking
      });
    //   drivers_sending.push(driver.id)
    // }

    // Lắng nghe phản hồi từ tài xế
    console.log("Đang chờ phản hồi từ tài xế: " + driver.id)
    await sleep(30000);
    // Xử lý timeout nếu tài xế không phản hồi sau một khoảng thời gian nhất định
    if (drivers_accepted.includes(driver.id)) {
      // Process the case where the driver did not reject the request
      console.log("Driver " + driver.id + " accepted the request");
      const index = drivers_accepted.indexOf(driver.id);
      const index_sending = drivers_sending.indexOf(driver.id);
      if (index !== -1) {
        drivers_accepted.splice(index, 1);
      }
      if (index_sending !== -1) {
        drivers_sending.splice(index_sending, 1);
      }
      return driver.id;
    } else {
      // Process the case where the driver rejected the request
      console.log("Driver " + driver.id + " rejected the request");
      return null;
    }
  } catch (err) {
    console.error(`Error sending request to Driver ${driver.id}:`, err.message);
    throw err;
  }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  handleDriverConnection,
  sendRequestToDrivers
};