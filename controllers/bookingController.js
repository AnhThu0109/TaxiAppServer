let controller = {};
const { query } = require("express");
let models = require("../models");
let BookingForm = models.BookingForm;
let Bill = models.Bill;
let BookingInfo = models.BookingInfo;
let Sequelize = require("sequelize");
const { findCarByDriverId } = require("./carController");
let Op = Sequelize.Op;

controller.getAll = () => {
  return new Promise((resolve, reject) => {
    BookingForm.findAndCountAll({
      include: [
        { model: models.Customer, attributes: ["id", "fullname", "phoneNo"] },
        {
          model: models.BookingStatusId,
          attributes: ["id", "status_description"],
        },
        { model: models.Bill, attributes: ["id", "sum", "status"] },
        {
          model: models.Car,
          attributes: ["id", "carName", "carType"],
          include: [
            { model: models.Service, attributes: ["id", "serviceName"] },
          ],
        },
      ],
    })
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error)));
  });
};

controller.getByAdminId = (id) => {
  return new Promise((resolve, reject) => {
    BookingForm.findAll({
      where: { adminId: id },
      include: [
        { model: models.Customer, attributes: ["id", "fullname", "phoneNo"] },
        {
          model: models.BookingStatusId,
          attributes: ["id", "status_description"],
        },
        { model: models.Bill, attributes: ["id", "sum", "status"] },
        {
          model: models.Car,
          attributes: ["id", "carName", "carType"],
          include: [
            { model: models.Service, attributes: ["id", "serviceName"] },
          ],
        },
      ],
    })
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error)));
  });
};
controller.getByBookingId = (id) => {
  return new Promise((resolve, reject) => {
    BookingForm.findOne({
      where: { id: id },
      include: [
        { model: models.Customer, attributes: ["id", "fullname", "phoneNo"] },
        {
          model: models.BookingStatusId,
          attributes: ["id", "status_description"],
        },
        { model: models.Bill, attributes: ["id", "sum", "status"] },
        { model: models.Driver, attributes: ["id", "phoneNo", "fullname", "gender", "licensePlate"] },
        {
          model: models.Car,
          attributes: ["id", "carName", "carType"],
          include: [
            { model: models.Service, attributes: ["id", "serviceName"] },
          ]
        },
      ],
    })
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error)));
  });
};

controller.createBooking = (bookingData) => {
  return new Promise(async (resolve, reject) => {
    const { note, sum, ...bookingFormAttributes } = bookingData;

    try {
      // Create the BookingForm without the note and sum attributes
      const createdBookingForm = await BookingForm.create(
        bookingFormAttributes
      );

      // Create BookingInfo entry with the custom note (if present)
      if (note) {
        await BookingInfo.create({
          bookingFormId: createdBookingForm.id,
          note,
          adminId: createdBookingForm.adminId,
          driverId: createdBookingForm.driverId,
          customerId: createdBookingForm.customerId,
        });
      }

      // Create Bill entry with the sum (if present)
      await Bill.create({
        bookingFormId: createdBookingForm.id,
        note: note || null, // Set note to null if it's not provided
        customerId: createdBookingForm.customerId,
        sum: sum || null, // Set sum to null if it's not provided
        paymentType: createdBookingForm.paymentType,
        status: createdBookingForm.status,
      });

      resolve(createdBookingForm);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

module.exports = controller;
