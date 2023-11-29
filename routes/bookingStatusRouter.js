const express = require('express');
const router = express.Router();
const bookingStatusController = require('../controllers/bookingStatus');
const auth = require('../middleware/auth');

router.get('/', auth,(req, res, next) => {
    
    bookingStatusController
        .getAll()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => next(error));

});


router.delete('/delete/:statusId', (req, res) => {
    const statusIdToDelete = req.params.statusId;

    bookingStatusController.deleteStatus(statusIdToDelete)
        .then(message => res.status(200).json({ success: true, message }))
        .catch(error => res.status(400).json({ success: false, error: error.message }));
});


// Create a new BookingStatusId
router.post("/create", async (req, res) => {
  const { status_description } = req.body;

  try {
    const newBookingStatus = await bookingStatusController.createBookingStatus(
      status_description
    );
    res
      .status(201)
      .json({
        message: "Booking status created successfully",
        bookingStatus: newBookingStatus,
      });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all BookingStatusIds
router.get("/all", async (req, res) => {
  try {
    const allBookingStatuses =
      await bookingStatusController.findAllBookingStatuses();
    res.status(200).json(allBookingStatuses);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get BookingStatusId by ID
router.get("/:id", async (req, res) => {
  const statusId = req.params.id;

  try {
    const bookingStatus = await bookingStatusController.findBookingStatusById(
      statusId
    );

    if (!bookingStatus) {
      res.status(404).json({ message: "Booking status not found" });
    } else {
      res.status(200).json(bookingStatus);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a booking form
router.put("/update/:id", async (req, res, next) => {
  const bookingFormId = req.params.id;
  const updatedData = req.body; // The updated data provided in the request body

  try {
    const updatedBookingForm =
      await bookingFormController.updateBookingFormById(
        bookingFormId,
        updatedData
      );
    res.status(200).json(updatedBookingForm);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
