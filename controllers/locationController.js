let controller = {};
const { query } = require('express');
let models = require('../models');
let Location = models.Location;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getAll= () => {
    return new Promise((resolve, reject) => {
        
        Location.findAndCountAll({
            attributes: ['id', 'latitude', 'longitude', 'locationName']
            
        })
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};






module.exports = controller;