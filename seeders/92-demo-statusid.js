'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [
      {id: 1, status_description: "Đặt chuyến xe"},
      {id: 2, status_description: "Đang tìm tài xế"},
      {id: 3, status_description: "Tài xế đã nhận cuốc xe"},
      {id: 4, status_description: "Tài xế đang đón khách"},
      {id: 5, status_description: "Đang trên đường đi"},
      {id: 6, status_description: "Đã đến nơi"},
      {id: 7, status_description: "Hoàn thành"} 
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
    await queryInterface.bulkInsert("BookingStatusId", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BookingStatusId', null, {});
  }
};
