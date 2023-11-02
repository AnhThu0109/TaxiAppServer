'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [
      {id: 1, sum: 52, paymentType: 1, status: 1, note: null, customerId: 1, carId: 3},
      {id: 2, sum: 60, paymentType: 1, status: 1, note: null, customerId: 3, carId: 1},
      {id: 3, sum: 37, paymentType: 1, status: 1, note: null, customerId: 1, carId: 7},
      {id: 4, sum: 25, paymentType: 1, status: 2, note: null, customerId: 1, carId: null},
      {id: 5, sum: 235.5, paymentType: 1, status: 1, note: null, customerId: 5, carId: 3},
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
    await queryInterface.bulkInsert("Bills", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bills', null, {});
  }
};
