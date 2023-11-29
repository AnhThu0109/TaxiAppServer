let controller = {};
const { query } = require("express");
let models = require("../models");
let Car = models.Car;
let Sequelize = require("sequelize");
let Op = Sequelize.Op;

controller.getAll = () => {
  return new Promise((resolve, reject) => {
    Car.findAndCountAll({
      attributes: ["id", "licensePlate", "carName", "carType", "serviceId"],
    })
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error)));
  });
};


controller.updateCar = (newCar) => {
    const driverId = newCar.driverId;
    //const updatestatus_description = status.status_description;
    
    return new Promise((resolve, reject) => {
        // Assuming carTypeData is an object with the required properties (e.g., { car_type: 'Sedan' })
        Car.findOne({ where: { driverId : driverId}})
        .then(data => {
            if (!data) {
                reject(new Error('Car not found.'));
            } else {
                // Nếu statusId tồn tại, thực hiện cập nhật
                data.update(newCar)
                    .then(update => resolve(update))
                    .catch(error => reject(new Error(error)));
            }
        })
        .catch(error => reject(new Error(error)));
    })
}
controller.getByDriverId= (id) => {
    return new Promise((resolve, reject) => {
        
        Car.findOne({ where: { driverId : id}})
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.deleteCar = (driverId) => {
    return new Promise((resolve, reject) => {
        // Kiểm tra xem statusId có tồn tại không
        Car.findOne({ where: { driverId : driverId}})
            .then(car => {
                if (!car) {
                    reject(new Error('Car not found.'));
                } else {
                    // Nếu statusId tồn tại, thực hiện xoá
                    car.destroy()
                        .then(() => resolve('Car deleted successfully.'))
                        .catch(error => reject(new Error(error)));
                }
            })
            .catch(error => reject(new Error(error)));
    });
}
controller.createCar = (carData) => {
  return new Promise((resolve, reject) => {
    Car.create(carData)
      .then((createdCar) => resolve(createdCar))
      .catch((error) => reject(new Error(error)));
  });
};

controller.findCarByDriverId = async (driverId) => {
  try {
    const car = await Car.findOne({
      where: { driverId },
    });

    return car;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = controller;
