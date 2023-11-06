'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingStatusId extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
  
      BookingStatusId.hasMany(models.BookingForm, {foreignKey: 'status'});
    }
  }
  BookingStatusId.init({
    status_description: DataTypes.STRING
    
  }, {
    sequelize,
    modelName: 'BookingStatusId',
    freezeTableName:true,
  });
  return BookingStatusId;
};