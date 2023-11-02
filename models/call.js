'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Call extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Call.belongsTo(models.Customer, {foreignKey: 'customerId'});
      Call.belongsTo(models.Admin, {foreignKey: 'adminId'});
    }
  }
  Call.init({
    time: DataTypes.INTEGER,
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Call',
  });
  return Call;
};