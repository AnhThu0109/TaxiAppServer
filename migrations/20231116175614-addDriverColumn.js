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
      queryInterface.addColumn('Drivers', 'status',
      {
        type: Sequelize.STRING
      }
      ), queryInterface.addColumn('Drivers', 'socketId',
      {
        type: Sequelize.STRING
      }
      ), queryInterface.addColumn('Drivers', 'location',
      {
        type: Sequelize.GEOMETRY('POINT')
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
      queryInterface.removeColumn('Drivers', 'status'),
      queryInterface.removeColumn('Drivers', 'socketId'),
      queryInterface.removeColumn('Drivers', 'location')
    ]);
  }
};
