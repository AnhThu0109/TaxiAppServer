'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CarType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CarType.hasMany(models.Car, {foreignKey: 'carType'});
    }
  }
  CarType.init({
    car_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CarType',
  });
  return CarType;
};