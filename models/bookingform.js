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
      BookingForm.belongsTo(models.BookingStatusId , {foreignKey: 'status'});
    }
  }
  BookingForm.init({
    pickupLocation: DataTypes.GEOMETRY('POINT'),
    destination: DataTypes.GEOMETRY('POINT'),
    bookingWay: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    bookingTime: DataTypes.DATE,
    Trip_Start_Time: DataTypes.TIME,
    Trip_End_Time: DataTypes.TIME,
    distance: DataTypes.STRING,
    service: DataTypes.STRING,
    carType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BookingForm',
  });
  return BookingForm;
};