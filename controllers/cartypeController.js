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






module.exports = controller;