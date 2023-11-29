const models = require("../models");
const BookingStatusId = models.BookingStatusId;
let controller = {};

controller.createBookingStatus = async (statusDescription) => {
  try {
    const newBookingStatus = await BookingStatusId.create({
      status_description: statusDescription,
    });
    console.log("Booking status created successfully:", newBookingStatus);
    return newBookingStatus;
  } catch (error) {
    console.error("Error creating booking status:", error);
    throw error;
  }
};

controller.findAllBookingStatuses = async () => {
  try {
    const allBookingStatuses = await BookingStatusId.findAll();
    console.log("All booking statuses:", allBookingStatuses);
    return allBookingStatuses;
  } catch (error) {
    console.error("Error fetching all booking statuses:", error);
    throw error;
  }
};

controller.findBookingStatusById = async (statusId) => {
  try {
    const bookingStatus = await BookingStatusId.findByPk(statusId);
    if (!bookingStatus) {
      console.log("Booking status not found.");
      return null;
    }
    console.log("Booking status found by ID:", bookingStatus);
    return bookingStatus;
  } catch (error) {
    console.error("Error fetching booking status by ID:", error);
    throw error;
  }
};

module.exports = controller;
