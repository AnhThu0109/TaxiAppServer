let controller = {};
const { query } = require('express');
let models = require('../models');
let BookingForm = models.BookingForm;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getAll= () => {
    return new Promise((resolve, reject) => {
        
        BookingForm.findAndCountAll({
            include: [{ model: models.Customer, attributes: ['id', 'fullname', 'phoneNo'] },
                      { model: models.BookingStatusId, attributes: ['id', 'status_description'] },
                      { model: models.Bill, attributes: ['id', 'sum', 'status'] },
                      { model: models.Car, attributes: ['id','carName', 'carType'],
                                include: [{model: models.Service, attributes: ['id','serviceName'] }]
                      }
                    ],
            
        })
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.getByAdminId = (id) => {
    return new Promise((resolve, reject) => {
        let admin;
        BookingForm.findAll({
            where: {adminId: id},
            include: [{ model: models.Customer, attributes: ['id', 'fullname', 'phoneNo'] },
                      { model: models.BookingStatusId, attributes: ['id', 'status_description'] },
                      { model: models.Bill, attributes: ['id', 'sum', 'status'] },
                      { model: models.Car, attributes: ['id','carName', 'carType'],
                                include: [{model: models.Service, attributes: ['id','serviceName'] }]
                      }
                    ],
        }).then(data => resolve(data))
        .catch(error => reject(new Error(error)));
        
    })
}
controller.getByBookingId = (id) => {
    return new Promise((resolve, reject) => {
        let admin;
        BookingForm.findOne({
            where: {id: id},
            include: [{ model: models.Customer, attributes: ['id', 'fullname', 'phoneNo'] },
                      { model: models.BookingStatusId, attributes: ['id', 'status_description'] },
                      { model: models.Bill, attributes: ['id', 'sum', 'status'] },
                      { model: models.Car, attributes: ['id','carName', 'carType'],
                                include: [{model: models.Service, attributes: ['id','serviceName'] }]
                      }
                    ],
        }).then(data => resolve(data))
        .catch(error => reject(new Error(error)));
        
    })
}




module.exports = controller;