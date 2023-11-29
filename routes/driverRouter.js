const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const auth = require("../middleware/auth");

router.post('/register', driverController.register);
router.post('/login', driverController.login);
router.put('/update',driverController.update);
router.get("/", auth, driverController.findAllDrivers);

router.get("/nearbydrivers", auth, async (req, res) => {
    //console.log("req"+req.body.longitude)
    try {
        let driver = await driverController.NearByDrivers(req.body.longitude, req.body.latitude);
        res.status(200).send(driver);
    } catch (err){
        console.log(err.message);
        res.status(400).send("Error"+ err.message);
    }
});
//router.get("/:id", auth, driverController.findDriverById);
router.get("/:id", auth, async (req, res) => {
    //console.log("req"+req.body.longitude)
    try {
        let driver = await driverController.findDriverById(req.params.id);
        if (!driver) {
            res.status(404).send('Driver not found');
            return;
        }
        res.status(200).json(driver);
    } catch (err){
        console.log(err.message);
        res.status(400).send("Error"+ err.message);
    }
});

module.exports = router;