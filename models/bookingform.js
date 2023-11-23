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
    pickupLocation: DataTypes.STRING,
    destination: DataTypes.STRING,
    bookingWay: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    bookingTime: DataTypes.DATE,
    Trip_Start_Time: DataTypes.TIME,
    Trip_End_Time: DataTypes.TIME,
    distance: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BookingForm',
    hooks: {
      // Create a BookingInfo entry after creating a BookingForm
      afterCreate: async (bookingForm, options) => {
        // Check if the note attribute is present in the bookingForm data
        const customNote = bookingForm.note ? bookingForm.note : null;

        // Create BookingInfo entry with the custom note (if present)
        await sequelize.models.BookingInfo.create({ bookingFormId: bookingForm.id, note: customNote, adminId: bookingForm.adminId, driverId: bookingForm.driverId, customerId: bookingForm.customerId});

        // Create Bill
        await sequelize.models.Bill.create({ bookingFormId: bookingForm.id, note: customNote, customerId: bookingForm.customerId, sum: bookingForm.sum, paymentType: bookingForm.paymentType, status: bookingForm.status});
      },
    },
  });
  return BookingForm;
};