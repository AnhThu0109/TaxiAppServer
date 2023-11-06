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
      queryInterface.addConstraint('BookingForms', {
        fields: ['status'],
        type: 'foreign key',
        name: 'status_fkey_constraint_name',
        references: { //Required field
          table: 'BookingStatusId',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeConstraint('BookingForms','status_fkey_constraint_name')
    ])
  }
};
