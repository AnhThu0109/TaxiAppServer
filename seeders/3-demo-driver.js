'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [
      {id: 1, password: "fghtDN121", fullname: "Nguyễn Gia Bảo", phoneNo: "0819180888", gender: "Male", licensePlate: "51F-65484"},
      {id: 2, password: "zvbSASD6", fullname: "Lý Kim Lợi", phoneNo: "0937217777", gender: "Male", licensePlate: "30F-23444"},
      {id: 3, password: "435JGbs", fullname: "Nguyễn Thanh Huy", phoneNo: "0819180890", gender: "Male", licensePlate: "37B1-28882"},
      {id: 4, password: "dfdQJS7S", fullname: "Trần Hoàng Nhật Duy", phoneNo: "0123455667", gender: "Male", licensePlate: "50E2-12778"},
      {id: 5, password: "YGWBDi383", fullname: "Lê Bảo Ngọc", phoneNo: "0127033338", gender: "Female", licensePlate: "51B1-32990"},
      {id: 6, password: "e343sSADF", fullname: "Nguyễn Đức Tuấn", phoneNo: "0810839990", gender: "Male", licensePlate: "51F-88838"},
      {id: 7, password: "jsYDUV2", fullname: "Trần Ánh Đào", phoneNo: "0125778980", gender: "Female", licensePlate: "59A2-12345"},
      {id: 8, password: "83JDBFw", fullname: "Lý Thanh", phoneNo: "0817980008", gender: "Male", licensePlate: "62B2-21880"},
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
    await queryInterface.bulkInsert("Drivers", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Drivers', null, {});
  }
};
