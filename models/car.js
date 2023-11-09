'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Car.belongsTo(models.Driver, {foreignKey: 'driverId'});
      Car.belongsTo(models.Service, {foreignKey: 'serviceId'});
      Car.hasMany(models.BookingForm, {foreignKey: 'carId'});
      Car.belongsTo(models.CarType, {foreignKey: 'carType'}); 
    }
  }
  Car.init({
    licensePlate: DataTypes.STRING,
    carName: DataTypes.STRING,
    carType: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Car',
  });
  return Car;
};