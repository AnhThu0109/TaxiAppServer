let controller = {};
const { query } = require('express');
let models = require('../models');
let BookingStatus = models.BookingStatusId;
let Sequelize = require('sequelize');
let Op = Sequelize.Op;

controller.getAll= () => {
    return new Promise((resolve, reject) => {
        
        BookingStatus.findAll({attributes: ['id', 'status_description']})
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));
    });
};

controller.addStatus = (status) => {
    return new Promise((resolve, reject) => {
        // Assuming carTypeData is an object with the required properties (e.g., { car_type: 'Sedan' })
        BookingStatus.create(status)
            .then(newStatus => resolve(newStatus))
            .catch(error => reject(new Error(error)));
    });
};

controller.updateStatus = (status) => {
    const statusId = status.id;
    const updatestatus_description = status.status_description;
    
    return new Promise((resolve, reject) => {
        // Assuming carTypeData is an object with the required properties (e.g., { car_type: 'Sedan' })
        BookingStatus.findByPk(statusId)
        .then(data => {
            if (!data) {
                reject(new Error('Booking status not found.'));
            } else {
                // Nếu statusId tồn tại, thực hiện cập nhật
                data.update(status)
                    .then(updatedStatus => resolve(updatedStatus))
                    .catch(error => reject(new Error(error)));
            }
        })
        .catch(error => reject(new Error(error)));
    })
}

controller.deleteStatus = (statusId) => {
    return new Promise((resolve, reject) => {
        // Kiểm tra xem statusId có tồn tại không
        BookingStatus.findByPk(statusId)
            .then(status => {
                if (!status) {
                    reject(new Error('Booking status not found.'));
                } else {
                    // Nếu statusId tồn tại, thực hiện xoá
                    status.destroy()
                        .then(() => resolve('Booking status deleted successfully.'))
                        .catch(error => reject(new Error(error)));
                }
            })
            .catch(error => reject(new Error(error)));
    });
};

module.exports = controller;