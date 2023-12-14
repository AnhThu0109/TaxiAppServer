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
    //1: Đặt chuyến xe
    //2: Đang tìm tài xế
    //3: Tài xế đã nhận cuốc xe
    //4: Tài xế đang đón khách
    //5: Đang trên đường đi
    //6: Đã đến nơi
    //7: Hoàn thành
    //8: Huỷ
    //9: Không có tài xế nhận đơn
  }, {
    sequelize,
    modelName: 'BookingStatusId',
    freezeTableName:true,
  });
  return BookingStatusId;
};