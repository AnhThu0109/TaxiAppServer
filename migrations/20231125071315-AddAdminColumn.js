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
      queryInterface.addColumn('Admins', 'address',
      {
        type: Sequelize.STRING
      }
      ), queryInterface.addColumn('Admins', 'birthday',
      {
        type: Sequelize.DATEONLY
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
      queryInterface.removeColumn('Admins', 'address'),
      queryInterface.removeColumn('Admins', 'birthday')
      
    ]);
  }
};
