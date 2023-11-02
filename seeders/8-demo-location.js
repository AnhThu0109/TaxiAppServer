'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [
      {id: 1, latitude: 10.80201, longitude: 106.63881, locationName: "Etown", bookingFormId: 1},
      {id: 2, latitude: 10.802173, longitude: 106.558975, locationName: "Gigamall", bookingFormId: 3},
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
    await queryInterface.bulkInsert("Locations", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Locations', null, {});
  }
};
