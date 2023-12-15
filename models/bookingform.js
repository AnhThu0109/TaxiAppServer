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
      BookingForm.belongsTo(models.Location, { foreignKey: 'pickupLocationId', as: 'pickupLocation' });
      BookingForm.belongsTo(models.Location, { foreignKey: 'destinationId', as: 'destination' });
    }
  }
  BookingForm.init({
    pickupLocationId: DataTypes.INTEGER,
    destinationId: DataTypes.INTEGER,
    bookingWay: DataTypes.INTEGER, //1: Web; 2: App
    status: DataTypes.INTEGER,
    bookingTime: DataTypes.DATE,
    Trip_Start_Time: DataTypes.DATE,
    Trip_End_Time: DataTypes.DATE,
    distance: DataTypes.STRING,
    service: DataTypes.STRING, //1: Standard; 2: Plus
    carType: DataTypes.STRING //1: Motorcycle; 2: Car
  }, {
    sequelize,
    modelName: 'BookingForm',
  });
  return BookingForm;
};