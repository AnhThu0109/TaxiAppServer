'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [
      {id: 1, licensePlate: "30F-23444", carName: "Mitsubishi Xpander", carType: 7, driverId: 2, serviceId: 1},
      {id: 2, licensePlate: "37B1-28882", carName: "Honda Wave", carType: 2, driverId: 3, serviceId: 1},
      {id: 3, licensePlate: "50E2-12778", carName: "Honda Vision", carType: 2, driverId: 4, serviceId: 2},
      {id: 4, licensePlate: "51B1-32990", carName: "Honda ShMode", carType: 2, driverId: 5, serviceId: 2},
      {id: 5, licensePlate: "51F-65484", carName: "Sedan", carType: 4, driverId: 1, serviceId: 2},
      {id: 6, licensePlate: "51F-88838", carName: "Toyota Vios", carType: 4, driverId: 6, serviceId: 1},
      {id: 7, licensePlate: "59A2-12345", carName: "Yamaha Sirius", carType: 2, driverId: 7, serviceId: 1},
      {id: 8, licensePlate: "62B2-21880", carName: "Honda Future", carType: 2, driverId: 8, serviceId: 1},
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
    await queryInterface.bulkInsert("Cars", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cars', null, {});
  }
};
