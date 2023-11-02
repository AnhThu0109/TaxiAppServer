'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [
      {id: 1, note: null, adminId: null, customerId: 1, bookingFormId: 1, driverId: 4},
      {id: 2, note: null, adminId: 3, customerId: 3, bookingFormId: 2, driverId: 2},
      {id: 3, note: null, adminId: null, customerId: 1, bookingFormId: 3, driverId: 7},
      {id: 4, note: null, adminId: null, customerId: 1, bookingFormId: 4, driverId: null},
      {id: 5, note: null, adminId: 2, customerId: 5, bookingFormId: 5, driverId: 6},
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
    await queryInterface.bulkInsert("BookingInfos", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BookingInfos', null, {});
  }
};