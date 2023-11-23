let controller = {};
const { query } = require("express");
let models = require("../models");
let Service = models.Service;
let Sequelize = require("sequelize");
let Op = Sequelize.Op;

controller.getAll = () => {
  return new Promise((resolve, reject) => {
    Service.findAll({ attributes: ["id", "serviceName"] })
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error)));
  });
};

controller.createService = (serviceData) => {
  return new Promise((resolve, reject) => {
    Service.create(serviceData)
      .then((createdService) => resolve(createdService))
      .catch((error) => reject(new Error(error)));
  });
};

module.exports = controller;
