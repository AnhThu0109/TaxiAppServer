let controller = {};
const { query } = require('express');
let models = require('../models');
let BookingForm = models.BookingForm;
let Bill = models.Bill;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;
const sequelize = new Sequelize('taxiappdb', 'postgres', '123456', {
    host: 'localhost',
    dialect: 'postgres', // or 'mysql', 'sqlite', 'mssql', etc.
  });
  
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

controller.save = async (booking) => {
    let transaction;
    try {
        
        transaction = await sequelize.transaction();
        const savedBooking = await BookingForm.create({
            pickupLocation: booking.pickupLocation,
            destination: booking.destination,
            bookingWay: booking.bookingWay,
            status: 1,
            bookingTime: booking.bookingTime,
            adminId: booking.adminId,
            customerId: booking.customerId
        }, {transaction});
        await Bill.create({
            sum: booking.sum,
            paymentType: booking.paymentType,
            status: booking.paymentStatus,
            note: booking.note,
            customerId: booking.customerId,
            bookingFormId: savedBooking.id
        }, {transaction});
        await transaction.commit();
        return savedBooking;
    }
    catch (err){
        if (transaction) await transaction.rollback();
        console.log(err.message);
        throw err;
    }
}
controller.updateDriverAccepted = (booking) =>{
    
    return new Promise((resolve, reject) => {
        //status: 3 (tài xế đã nhận cuốc xe)
        BookingForm.update({
            status: booking.status,
            driverId: booking.driverId,
            
        }, {
            where: {
                id: booking.id,
            },
        })
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
}

module.exports = controller;