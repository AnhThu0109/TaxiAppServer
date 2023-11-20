const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const auth = require("../middleware/auth");

router.post('/register', driverController.register);
router.post('/login', driverController.login);
router.get("/", auth, driverController.findAllDrivers);
router.get("/:id", auth, driverController.findDriverById);

module.exports = router;