const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

router.post('/register', driverController.register);
router.post('/login', driverController.login);
router.put('/update',driverController.update);

module.exports = router;