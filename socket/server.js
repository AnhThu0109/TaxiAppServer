var distance = require('google-distance-matrix');

let models = require('../models');
let Driver = models.Drivers;

const driverLocationController = require('../controllers/driverLocationController');
const driverController = require('../controllers/driverController');
const bookingController = require('../controllers/bookingController');

distance.key('AIzaSyBv_3P3yNTVYWvi3fdSENaTV-jJ1XzWWAw');
distance.units('metric');
distance.language('vn');
distance.mode('driving');

let drivers = [];

let drivers_accepted = [];

const handleDriverConnection = (socket) => {
  console.log('Driver online:', socket.id);

    socket.on('driver_connect', async (driver) => {
        console.log(driver.id);
        console.log("socket id: "+socket.id)
       
        try {
           await driverController.update(driver,socket)
          
        } catch (err){
           console.error('Error updating user:', err.message);
            //socket.emit('Error',{ message: err.message })
        }        

    })


  socket.on('driver_rejected', () => {
    console.log('Driver rejected:', socket.id);
    // handle next driver
  });
  //tài xế nhận cuốc xe
  socket.on('driver_accepted:'+ socket.id, (booking) => {
    console.log('Driver accepted:', socket.id);
    //console.log('booking:' + booking.status);
    console.log('driverId:' + booking.driverId);
    // handle booking
    const driverId = booking.driverId;
    //const socketId = socket.id;
    drivers_accepted.push(driverId);
  });
  socket.on('driver_arrived:'+ socket.id, (booking) => {
    console.log('Driver arrived:', socket.id);
    //console.log('booking:' + booking.status);
    console.log('driverId:' + booking.driverId);
    // handle booking
    bookingController.updateDriverAccepted(booking);
   
  });

  socket.on('driver_completed'+ socket.id, (booking) => {
    console.log('Driver completed:', socket.id);
    // handle booking
    bookingController.updateDriverAccepted(booking);
    
  });

  socket.on('disconnect'+socket.id, async (driver) => {
    console.log('Driver disconnected:', socket.id);
    driver.status = 'Disconnect';
    try {
      await driverController.update(driver,socket)
     
   } catch (err){
      console.error('Error updating user:', err.message);
       //socket.emit('Error',{ message: err.message })
   }        

    
  });
}

async function sendRequestToDrivers(driver,booking, io) {
  try {
    const longitude = booking.longitude;
    const latitude = booking.latitude;
    io.to(driver.socketId).emit('rideRequest', {
      requestId: 'uniqueRequestId',
      location: { longitude, latitude },
      bookingInfo: booking
    });

    // Lắng nghe phản hồi từ tài xế
    console.log("Đang chờ phản hồi từ tài xế: " + driver.id)
    await sleep(30000);
    // Xử lý timeout nếu tài xế không phản hồi sau một khoảng thời gian nhất định
    if (drivers_accepted.includes(driver.id)) {
      // Process the case where the driver did not reject the request
      console.log("Driver " + driver.id + " accepted the request");
      return driver.id;
  } else {
      // Process the case where the driver rejected the request
      console.log("Driver " + driver.id + " rejected the request");
      return null;
  }
  } catch (err){
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