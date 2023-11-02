'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = [
      {id: 1, time: 300, note: null, adminId: 3, customerId: 3},
      {id: 2, time: 425, note: null, adminId: 2, customerId: 5},
    ];
    data.map(item => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
      return item;
    });
    await queryInterface.bulkInsert("Calls", data, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Calls', null, {});
  }
};
