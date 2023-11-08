let controller = {};
const { query } = require('express');
let models = require('../models');
let Car = models.Car;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getAll= () => {
    return new Promise((resolve, reject) => {
        
        Car.findAndCountAll({
            attributes: ['id', 'licensePlate', 'carName', 'carType','serviceId' ] 
            
        })
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};





module.exports = controller;