const models = require('../models');
const Location = models.Location;
const { validationResult } = require('express-validator');

const locationController = {
  getAll: async (req, res) => {
    try {
      const locations = await Location.findAll({
        attributes: ['id', 'latitude', 'longitude', 'locationName']
      });
      res.status(200).json(locations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createLocation: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { latitude, longitude, locationName, bookingFormId } = req.body;

    try {
      const newLocation = await Location.create({
        latitude: latitude,
        longitude: longitude,
        locationName: locationName,
        bookingFormId: bookingFormId // Assuming bookingFormId is optional and may not always be provided
      });

      res.status(201).json(newLocation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = locationController;
