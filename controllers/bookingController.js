let controller = {};
const { query } = require("express");
let models = require("../models");
let BookingForm = models.BookingForm;
let Bill = models.Bill;
let Sequelize = require("sequelize");
let Op = Sequelize.Op;
const sequelize = new Sequelize("taxiapp", "postgres", "new_password", {
  host: "localhost",
  dialect: "postgres", // or 'mysql', 'sqlite', 'mssql', etc.
});

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
        {
          model: models.Location, // Include the Location model
          as: "pickupLocation", // Assuming there's an alias, adjust accordingly
          attributes: ["id", "latitude", "longitude", "locationName"],
        },
        {
          model: models.Location, // Include the Location model
          as: "destination", // Assuming there's an alias, adjust accordingly
          attributes: ["id", "latitude", "longitude", "locationName"],
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
      where: { adminId: id, bookingWay: 1 },
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
        {
          model: models.Location, // Include the Location model
          as: "pickupLocation", // Assuming there's an alias, adjust accordingly
          attributes: ["id", "latitude", "longitude", "locationName"],
        },
        {
          model: models.Location, // Include the Location model
          as: "destination", // Assuming there's an alias, adjust accordingly
          attributes: ["id", "latitude", "longitude", "locationName"],
        },
      ],
    })
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error)));
  });
};

controller.getByDriverId = (id) => {
  return new Promise((resolve, reject) => {
    BookingForm.findAll({
      where: { driverId: id },
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
        {
          model: models.Location, // Include the Location model
          as: "pickupLocation", // Assuming there's an alias, adjust accordingly
          attributes: ["id", "latitude", "longitude", "locationName"],
        },
        {
          model: models.Location, // Include the Location model
          as: "destination", // Assuming there's an alias, adjust accordingly
          attributes: ["id", "latitude", "longitude", "locationName"],
        },
      ],
    })
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error)));
  });
};

controller.getByCustomerId = (id) => {
  return new Promise((resolve, reject) => {
    BookingForm.findAll({
      where: { customerId: id },
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
        {
          model: models.Location, // Include the Location model
          as: "pickupLocation", // Assuming there's an alias, adjust accordingly
          attributes: ["id", "latitude", "longitude", "locationName"],
        },
        {
          model: models.Location, // Include the Location model
          as: "destination", // Assuming there's an alias, adjust accordingly
          attributes: ["id", "latitude", "longitude", "locationName"],
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
        {
          model: models.Car,
          attributes: ["id", "carName", "carType"],
          include: [
            { model: models.Service, attributes: ["id", "serviceName"] },
          ],
        },
        {
          model: models.Location, // Include the Location model
          as: "pickupLocation", // Assuming there's an alias, adjust accordingly
          attributes: ["id", "latitude", "longitude", "locationName"],
        },
        {
          model: models.Location, // Include the Location model
          as: "destination", // Assuming there's an alias, adjust accordingly
          attributes: ["id", "latitude", "longitude", "locationName"],
        },
      ],
    })
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error)));
  });
};

controller.save = async (booking) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const savedBooking = await BookingForm.create(
      {
        pickupLocationId: booking.pickupLocationId,
        destinationId: booking.destinationId,
        bookingWay: booking.bookingWay, //1: Web; 2: App
        status: 1,
        bookingTime: booking.bookingTime,
        adminId: booking.adminId,
        customerId: booking.customerId,
        distance: booking.distance,
        service: booking.service,
        carType: booking.carType,
      },
      { transaction }
    );
    await Bill.create(
      {
        sum: booking.sum,
        paymentType: booking.paymentType,
        status: booking.paymentStatus,
        note: booking.note,
        customerId: booking.customerId,
        bookingFormId: savedBooking.id,
      },
      { transaction }
    );
    await transaction.commit();
    return savedBooking;
  } catch (err) {
    if (transaction) await transaction.rollback();
    console.log(err.message);
    throw err;
  }
};
controller.updateDriverAccepted = (booking) => {
  return new Promise((resolve, reject) => {
    //status: 3 (tài xế đã nhận cuốc xe)
    BookingForm.update(
      {
        status: booking.status,
        driverId: booking.driverId,
        distance: booking.distance
      },
      {
        where: {
          id: booking.id,
        },
      }
    )
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error)));
  });
};

controller.updateBookingStatus = (booking) => {
  return new Promise((resolve, reject) => {
    //1: On Progress (đang xử lý)
    //2: No drivers accepted the request
    //3: Running (đã có tài xế nhận cuốc)
    //4: Completed
    //5: Canceled
    BookingForm.update(
      {
        status: booking.status,
      },
      {
        where: {
          id: booking.id,
        },
      }
    )
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error)));
  });
};

// Update a booking form by ID
controller.updateBookingForm = (id, updatedData) => {
  return new Promise((resolve, reject) => {
    BookingForm.update(updatedData, {
      where: {
        id: id,
      },
    })
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error)));
  });
};

module.exports = controller;
