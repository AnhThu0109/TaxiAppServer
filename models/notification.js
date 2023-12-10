"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // define association here
      Notification.belongsTo(models.Admin, { foreignKey: "adminId" });
    }
  }

  Notification.init(
    {
      text: DataTypes.STRING,
      isRead: DataTypes.BOOLEAN,
      isErrorNoti: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );

  return Notification;
};
