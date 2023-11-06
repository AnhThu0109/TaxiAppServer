const express = require('express');
const router = express.Router();
const adminController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.get('/', auth,(req, res, next) => {
    let bookingController = require('../controllers/bookingController');
    bookingController
        .getAll()
        .then(data => {
            res.send(data);
        })
        .catch(error => next(error));

});


module.exports = router;