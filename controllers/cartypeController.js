let controller = {};
const { query } = require('express');
let models = require('../models');
let CarType = models.CarType;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getAll= () => {
    return new Promise((resolve, reject) => {
        
        CarType.findAll({attributes: ['id', 'car_type']})
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.addCarType = (carTypeData) => {
    return new Promise((resolve, reject) => {
        // Assuming carTypeData is an object with the required properties (e.g., { car_type: 'Sedan' })
        CarType.create(carTypeData)
            .then(newCarType => resolve(newCarType))
            .catch(error => reject(new Error(error)));
    });
};

controller.updateCarType = (id, carTypeData) => {
//const id = carTypeData.id;
  //const updatestatus_description = status.status_description;
  
  return new Promise((resolve, reject) => {
      // Assuming carTypeData is an object with the required properties (e.g., { car_type: 'Sedan' })
      CarType.findByPk(id)
      .then(data => {
          if (!data) {
              reject(new Error('Car type not found.'));
          } else {
              // Nếu statusId tồn tại, thực hiện cập nhật
              data.update(carTypeData)
                  .then(updatedCarType => resolve(updatedCarType))
                  .catch(error => reject(new Error(error)));
          }
      })
      .catch(error => reject(new Error(error)));
  })
}
controller.deleteCarType = (id) => {
    return new Promise((resolve, reject) => {
        // Kiểm tra xem statusId có tồn tại không
        CarType.findByPk(id)
            .then(cartype => {
                if (!cartype) {
                    reject(new Error('Car type not found.'));
                } else {
                    // Nếu statusId tồn tại, thực hiện xoá
                    cartype.destroy()
                        .then(() => resolve('Car type deleted successfully.'))
                        .catch(error => reject(new Error(error)));
                }
            })
            .catch(error => reject(new Error(error)));
    });
}

module.exports = controller;