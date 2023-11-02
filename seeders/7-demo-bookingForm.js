'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [
      {id: 1, pickupLocation: "Centec Tower", destination: "Etown", bookingWay: 2, status: 1, bookingTime: "2023-06-12 17:31:10", adminId: null, customerId: 1, driverId: 4, carId: 3, locationId: null},
      {id: 2, pickupLocation: "LandMark 81", destination: "Vicom Đồng Khởi", bookingWay: 1, status: 1, bookingTime: "2023-06-14 10:25:03", adminId: 3, customerId: 3, driverId: 2, carId: 1, locationId: null},
      {id: 3, pickupLocation: "Gigamall", destination: "127 Nguyễn Trãi, Q1", bookingWay: 2, status: 1, bookingTime: "2023-07-17 14:56:00", adminId: null, customerId: 1, driverId: 7, carId: 7, locationId: null},
      {id: 4, pickupLocation: "20 Phan Đăng Lưu, Bình Thạnh", destination: "183 Lê Văn Sỹ, Phú Nhuận", bookingWay: 2, status: 2, bookingTime: "2023-07-23 08:00:30", adminId: null, customerId: 1, driverId: null, carId: null, locationId: null},
      {id: 5, pickupLocation: "106 Tô Vĩnh Diện, Thủ Đức", destination: "Diamond Plaza", bookingWay: 1, status: 1, bookingTime: "2023-08-01 17:11:10", adminId: 2, customerId: 5, driverId: 6, carId: 3, locationId: null}
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
    await queryInterface.bulkInsert("BookingForms", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BookingForms', null, {});
  }
};
