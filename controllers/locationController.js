const models = require("../models");
const Location = models.Location;
const { validationResult } = require("express-validator");

const locationController = {
  getAll: async (req, res) => {
    try {
      const locations = await Location.findAll({
        attributes: ["id", "latitude", "longitude", "locationName"],
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
        bookingFormId: bookingFormId, // Assuming bookingFormId is optional and may not always be provided
      });

      res.status(200).json(newLocation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  findLocationsByKeyword: async (req, res) => {
    const { keyword } = req.query;
  
    try {
      const locations = await Location.findAll({
        where: {
          locationName: {
            [models.Sequelize.Op.iLike]: `${keyword}%`,
          },
        },
        attributes: ["id", "latitude", "longitude", "locationName"],
        order: [["createdAt", "DESC"]], // Order by createdAt in descending order
        limit: 3, // Limit the results to 3
      });
  
      res.status(200).json(locations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },  

  findLocationByLocationName: async (req, res) => {
    const { locationName } = req.body;

    try {
      const location = await Location.findOne({
        where: {
          locationName: {
            [models.Sequelize.Op.iLike]: locationName,
          },
        },
        attributes: ["id", "latitude", "longitude", "locationName"],
      });

      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }

      res.status(200).json(location);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getLocationById: async (locationId) => {
    try {
      const location = await Location.findOne({
        where: {
          id: locationId,
        },
        attributes: ["id", "latitude", "longitude", "locationName"],
      });

      if (!location) {
        return null; // Return null if the location is not found
      }

      return location;
    } catch (error) {
      throw new Error(`Error fetching location details: ${error.message}`);
    }
  },
};

module.exports = locationController;
