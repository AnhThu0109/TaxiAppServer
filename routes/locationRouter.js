const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// POST endpoint to create a new location
router.post('/create', [
    body('latitude').isNumeric(),
    body('longitude').isNumeric(),
    body('locationName').isString(),
    body('bookingFormId').optional().isNumeric()
], auth, locationController.createLocation);

// GET endpoint to retrieve all locations
router.get('/', auth, locationController.getAll);

module.exports = router;
