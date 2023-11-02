'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Driver extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Driver.hasMany(models.BookingForm, {foreignKey: 'driverId'});
      Driver.hasMany(models.BookingInfo, {foreignKey: 'driverId'});
      Driver.hasOne(models.Car, {foreignKey: 'driverId'});
    }
  }
  Driver.init({
    phoneNo: DataTypes.STRING,
    password: DataTypes.STRING,
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    avatarPath: DataTypes.STRING,
    licensePlate: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Driver',
  });
  return Driver;
};