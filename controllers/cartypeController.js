let controller = {};
const { query } = require('express');
let models = require('../models');
let CarType = models.CarType;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getAll= () => {
    return new Promise((resolve, reject) => {
        
        CarType.findAll({attributes: ['id', 'car_type']})
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.addCarType = (carTypeData) => {
    return new Promise((resolve, reject) => {
        // Assuming carTypeData is an object with the required properties (e.g., { car_type: 'Sedan' })
        CarType.create(carTypeData)
            .then(newCarType => resolve(newCarType))
            .catch(error => reject(new Error(error)));
    });
};




module.exports = controller;