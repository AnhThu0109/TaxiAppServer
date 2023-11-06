'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    
    return Promise.all([
      queryInterface.addColumn('BookingForms', 'Trip_Start_Time',
      {
        type: Sequelize.TIME
      }
      ), queryInterface.addColumn('BookingForms', 'Trip_End_Time',
      {
        type: Sequelize.TIME
      })
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn('BookingForms', 'Trip_Start_Time'),
      queryInterface.removeColumn('BookingForms', 'Trip_End_Time')
    ]);
  }
};
