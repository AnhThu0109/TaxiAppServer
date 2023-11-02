'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [
      {id: 1, password: "jdhJHB90", fullname: "Trần Thị Thanh", phoneNo: "0123456789", gender: "Female"},
      {id: 2, password: "DFNo8", fullname: "Lê Bát Nhã", phoneNo: "0123456700", gender: "Male"},
      {id: 3, password: "jdh92KH", fullname: "Nguyễn Tuân", phoneNo: "0123456701", gender: "Male"},
      {id: 4, password: "JHSuid9", fullname: "Lý Thu Hương", phoneNo: "0123456001", gender: "Female"},
      {id: 5, password: "jbsQQ341", fullname: "Nguyễn Thị Mai Chi", phoneNo: "0123450891", gender: "Female"} 
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
    await queryInterface.bulkInsert("Customers", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Customers', null, {});
  }
};
