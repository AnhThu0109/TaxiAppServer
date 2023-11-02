'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [
      {id: 1, username: "HoaNguyen", password: "yGJShsd982", fullname: "Nguyễn Thị Hoa", phoneNo: "0123456788", gender: "Female"},
      {id: 2, username: "HoangTran", password: "ejH934j", fullname: "Trần Hoàng", phoneNo: "0123456789", gender: "Male"},
      {id: 3, username: "KhanhLee", password: "Saae34d",fullname: "Lê Khanh", phoneNo: "0123456790", gender: "Female"} 
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
    await queryInterface.bulkInsert("Admins", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admins', null, {});
  }
};
