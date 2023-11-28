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
    //1: On Progress (đang xử lý)
    //2: No drivers accepted the request
    //3: Running (đã có tài xế nhận cuốc)
    //4: Completed
    //5: Canceled
  }, {
    sequelize,
    modelName: 'BookingStatusId',
    freezeTableName:true,
  });
  return BookingStatusId;
};