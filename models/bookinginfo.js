'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingInfo.belongsTo(models.Customer, {foreignKey: 'customerId'});
      BookingInfo.belongsTo(models.BookingForm, {foreignKey: 'bookingFormId'});
      BookingInfo.belongsTo(models.Driver, {foreignKey: 'driverId'});
      BookingInfo.belongsTo(models.Admin, {foreignKey: 'adminId'});
    }
  }
  BookingInfo.init({
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'BookingInfo',
  });
  return BookingInfo;
};