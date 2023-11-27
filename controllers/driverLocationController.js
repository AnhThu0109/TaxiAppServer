let controller = {};
const { query } = require('express');
let models = require('../models');
let Driver = models.Drivers;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.updateSocketId = (id, socketId) => {
    return new Promise((resolve, reject) => {
        Driver
            .update({ socketId: socketId }, {
                where: {
                    id: id,
                },
            })
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });

    /*return new Promise((resolve, reject) => {
        Driver.findAll({
            attributes: ['id', 'socketId', 'location'],
            where: {
                id: id,
            },
        
        })
        .then(data => resolve(data))
        .catch(error => reject(new Error(error)));
    });*/
    
};
controller.nearbyDriver = (longitude, latitude) => {
    return new Promise((resolve, reject) => {
        Driver.findAll({
            attributes: ['id', 'socketId', 'location'],
            where: Sequelize.where(
                Sequelize.fn(
                    'ST_DWithin',
                    Sequelize.col('location'),
                    Sequelize.fn('ST_MakePoint', parseFloat(longitude), parseFloat(latitude)),
                    10000
                ),
                true
            ),
        
        })
        .then(data => resolve(data))
        .catch(error => reject(new Error(error)));
    });
}
controller.getLocationById = (id) => {
    return new Promise((resolve, reject) => {
        Driver.findOne({
            attributes: ['id', 'socketId', 'location'],
            where: {
                id: id
            } 
        })
        .then(data => resolve(data))
        .catch(error => reject(new Error(error)));
    });
}
controller.updateLocation =(id,socketId, latitude, longitude) => {
    return new Promise((resolve, reject) => {
        Driver.update({
            socketId,
            coordinate: Sequelize.fn(
                'ST_GeomFromText',
                `POINT(${parseFloat(longitude)} ${parseFloat(latitude)})`
            ),
        },
        { where: { id }
        })
        .then(data => resolve(data))
        .catch(error => reject(new Error(error)));
    });
}
module.exports = controller;