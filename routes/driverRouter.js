const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const auth = require("../middleware/auth");
const driverMiddleware = require("../middleware/drivermiddleware")
router.post('/register', driverController.register);
router.post('/login', driverController.login);
router.post('/logout', driverController.logout);
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
router.put("/updatedriverinfo/:id", auth, driverMiddleware.driverExists, async (req, res, next) => {
    const {body, params:{id}, oldDriver} = req;
    console.log("oldDriver: "+oldDriver.id);
    console.log("id: "+id);
    try {
        
        if (id != oldDriver.id) {
            res.status(403).send({
                success: false,
                message: "You are not authorized to carry out this action",
            })
            return;
        }
        let driverUpdate = await driverController.update_driverInfo(req);
        res.status(200).send({
            success: true,
            message: "Cập nhật thành công",
            data: driverUpdate});
    } catch (err){
        console.log(err.message);
        res.status(400).send("Error"+ err.message);
    }
})
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    driverController.deleteDriver(id)
    .then(message => res.status(200).json({ success: true, message }))
    .catch(error => res.status(400).json({ success: false, error: error.message }));
  })
module.exports = router;