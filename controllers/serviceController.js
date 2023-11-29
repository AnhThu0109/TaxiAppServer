let controller = {};
const { query } = require('express');
let models = require('../models');
let Service = models.Service;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getAll= () => {
    return new Promise((resolve, reject) => {
        
        Service.findAll({attributes: ['id', 'serviceName']})
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.addService = (service) => {
    return new Promise((resolve, reject) => {
        // Assuming carTypeData is an object with the required properties (e.g., { car_type: 'Sedan' })
        Service.create(service)
            .then(newService => resolve(newService))
            .catch(error => reject(new Error(error)));
    });
};




module.exports = controller;