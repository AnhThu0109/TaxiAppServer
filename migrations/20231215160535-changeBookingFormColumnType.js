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
    await queryInterface.changeColumn('BookingForms', 'Trip_Start_Time', {
      type: Sequelize.DATE,
      allowNull: true, // Adjust allowNull based on your requirements
    });
    await queryInterface.changeColumn('BookingForms', 'Trip_End_Time', {
      type: Sequelize.DATE,
      allowNull: true, // Adjust allowNull based on your requirements
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('BookingForms', 'Trip_Start_Time', {
      type: Sequelize.TIME,
      allowNull: true, // Adjust allowNull based on your requirements
    });
    await queryInterface.changeColumn('BookingForms', 'Trip_End_Time', {
      type: Sequelize.TIME,
      allowNull: true, // Adjust allowNull based on your requirements
    });
  }
};
