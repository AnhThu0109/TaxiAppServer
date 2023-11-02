'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingForm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingForm.belongsTo(models.Customer, {foreignKey: 'customerId'});
      BookingForm.belongsTo(models.Driver, {foreignKey: 'driverId'});
      BookingForm.belongsTo(models.Admin, {foreignKey: 'adminId'});
      BookingForm.belongsTo(models.Car, {foreignKey: 'carId'});
      BookingForm.hasOne(models.BookingInfo, {foreignKey: 'bookingFormId'});
      BookingForm.hasOne(models.Bill, {foreignKey: 'bookingFormId'});
      BookingForm.hasMany(models.Location, {foreignKey: 'bookingFormId'});
    }
  }
  BookingForm.init({
    pickupLocation: DataTypes.STRING,
    destination: DataTypes.STRING,
    bookingWay: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    bookingTime: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'BookingForm',
  });
  return BookingForm;
};