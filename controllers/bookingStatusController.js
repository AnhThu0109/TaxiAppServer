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
