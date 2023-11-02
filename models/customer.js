'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.hasMany(models.BookingForm, {foreignKey: 'customerId'});
      Customer.hasMany(models.BookingInfo, {foreignKey: 'customerId'});
      Customer.hasMany(models.Call, {foreignKey: 'customerId'});
    }
  }
  Customer.init({
    phoneNo: DataTypes.STRING,
    password: DataTypes.STRING,
    fullname: DataTypes.STRING,
    gender: DataTypes.STRING,
    email: DataTypes.STRING,
    avatarPath: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};