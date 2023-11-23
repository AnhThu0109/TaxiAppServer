var distance = require('google-distance-matrix');

let models = require('../models');
let Driver = models.Drivers;

const driverLocationController = require('../controllers/driverLocationController');
const driverController = require('../controllers/driverController');

distance.key('AIzaSyBv_3P3yNTVYWvi3fdSENaTV-jJ1XzWWAw');
distance.units('metric');
distance.language('vn');
distance.mode('driving');

let drivers = [];

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

  socket.on('driver_location', (location) => {
    console.log('Driver location:', location);
    const driver = {
        id: socket.id,
        socket: socket,
        location: location,
        available: true
    };
    
    const index = drivers.findIndex((d) => d.id === driver.id);
    if (index >= 0) {
        drivers[index] = driver;
    } else {
        drivers.push(driver);
    }
  });

  socket.on('driver_rejected', () => {
    console.log('Driver rejected:', socket.id);
    // handle next driver
  });

  socket.on('driver_accepted', () => {
    console.log('Driver accepted:', socket.id);
    // handle booking

    drivers = drivers.map((driver) => {
      if (driver.id === socket.id) {
        return { ...driver, available: false };
      }
      return driver;
    });
  });

  socket.on('driver_completed', () => {
    console.log('Driver completed:', socket.id);
    // handle booking

    drivers = drivers.map((driver) => {
      if (driver.id === socket.id) {
        return { ...driver, available: true };
      }
      return driver;
    });
  });

  socket.on('disconnect', () => {
    console.log('Driver disconnected:', socket.id);
    drivers = drivers.filter((driver) => driver.id !== socket.id);
  });
}

const sendBookingToDriver = async (customerLocation) => {
  const nearestDriver = await findNearestDriver(customerLocation);
  if (nearestDriver) {
    nearestDriver.socket.emit('driver_new_booking', { driver: nearestDriver });
    return;
  }

  console.log('Can not find driver near customer');
}

// TODO: test send, should be move to api /book
// setTimeout(() => {
//   sendBookingToDriver([37.7749, -122.4194]);
// }, 3000);

async function findNearestDriver(customerLocation) {
  let nearestDriver = null;
  let minDistance = Infinity;

  for (const driver of drivers) {
    if (!driver.available) {
      continue;
    }
    const distances = await new Promise((resolve, reject) => {
      distance.matrix([customerLocation], [driver.location], (err, distances) => {
        if (err) {
          reject(err);
        } else {
          resolve(distances);
        }
      });
    });

    if (distances && distances.status === 'OK' && distances.rows[0].elements[0].status === 'OK') {
      const distance = distances.rows[0].elements[0].distance.value;
      if (distance < minDistance) {
        minDistance = distance;
        nearestDriver = driver;
      }
    }
  }

  return nearestDriver;
}

const sendRequestToDrivers = async (driver,booking, io) => {
  return new Promise((resolve, reject) => {
    const longitude = booking.longitude;
    const latitude = booking.latitude;
    io.to(driver.socketId).emit('rideRequest', {
      requestId: 'uniqueRequestId',
      location: { longitude, latitude },
    });

    // Lắng nghe phản hồi từ tài xế
    console.log("Đang chờ phản hồi từ tài xế" + driver.id)
    //handleDriverConnection(io);

    io.on('driver_accepted',  async (response) => {
      console.log('Driver:', io.id);
      // handle booking
      clearTimeout(timeoutId);
      console.log(response);
      resolve(response)
      
    });
    /*
    io.to(driver.socketId).on('rideResponse', (response) =>{
      console.log("socket id: "+io.id)
      resolve(response);
    });
    /*
    io.on('rideResponse', (response) => {
      console.log("socket id: "+io.id)
      resolve(response);
    });
    const driverSocket = io.to(driver.socketId)
    io.once('rideResponse', (response) => {
      resolve(response);
    });*/


    // Xử lý timeout nếu tài xế không phản hồi sau một khoảng thời gian nhất định
    const timeoutId = setTimeout(() => {
      reject(new Error('Timeout: No response from driver'));
    }, 20000); // Timeout sau 10 giây
  });
}

module.exports = {
  sendBookingToDriver,
  handleDriverConnection,
  sendRequestToDrivers
};