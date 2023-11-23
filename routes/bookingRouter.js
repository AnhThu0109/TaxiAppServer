const express = require('express');
const router = express.Router();
const adminController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
let bookingController = require('../controllers/bookingController');

router.get('/', auth,(req, res, next) => {
    bookingController
        .getAll()
        .then(data => {
            res.send(data);
        })
        .catch(error => next(error));

});
router.get('/admin/:id', auth,(req, res, next) => {
    bookingController
        .getByAdminId(req.params.id)
        .then(data => {
            res.send(data);
        })
        .catch(error => next(error));

});
router.get('/:id', auth,(req, res, next) => {
    bookingController
        .getByBookingId(req.params.id)
        .then(data => {
            res.send(data);
        })
        .catch(error => next(error));

});

// Create a new booking form
router.post('/create', auth, (req, res, next) => {
    const bookingData = req.body; // Assuming the data for creating a new booking form is sent in the request body
  
    bookingController
      .createBooking(bookingData)
      .then((createdBooking) => {
        res.status(200).json({ message: 'Booking form created successfully', booking: createdBooking });
      })
      .catch((error) => next(error));
  });

module.exports = router;