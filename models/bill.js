'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bill.belongsTo(models.Customer, {foreignKey: 'customerId'});
      Bill.belongsTo(models.Car, {foreignKey: 'carId'});
    }
  }
  Bill.init({
    sum: DataTypes.DECIMAL,
    paymentType: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    note: DataTypes.TEXT,
    createdTime: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Bill',
  });
  return Bill;
};