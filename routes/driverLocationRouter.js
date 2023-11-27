const express = require('express');
const router = express.Router();
const driverLocationController = require('../controllers/driverLocationController');
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.put('/driverLocationSocket/:id', (req, res, next) => {
    let id = req.params.id;
    console.log("id: "+id);
    let socketId = req.body.socketId;
    console.log("socketId: "+socketId);
    
    try {
        const updateDetails = driverLocationController.updateSocketId(id, socketId);
        res.send(updateDetails);
    } catch (err){
        res.status(500).send(err.message);
    }
    /*
    driverLocationController.updateSocketId(id, socketId)
    .then(data => {
        res.send(data);
    })
    .catch(error => next(error));*/

});

router.get('/driverLocation', (req, res, next) => {
    const {longitude, latitude} = req.query;
    try {
        const nearbyDrivers = driverLocationController.nearbyDrivers(longitude, latitude);
        res.send(nearbyDrivers);
    } catch (err) {
        res.status(500).send(err.message);
    }

})

router.get('/driverLocation/:id', (req, res, next) => {
    let io = req.app.io;
    try {
        const location = driverLocationController.getLocationById(req.params)
        res.send(location);
        io.emit("trackDriver", location);
    }catch (err) {
        res.status(500).send(err.message);
    }
})

router.put('/driverLocation/:id', (req, res, next) => {
    let io = req.app.io;
    const id = req.params;
    const {socketId, latitude, longitude} = req.body;
    try {
        const updateDetails = driverLocationController.updateLocation(id,socketId,latitude,longitude);
        const updateLocation = driverLocationController.getLocationById(id);
        res.send(updateLocation)

        io.emit("action", {
            type: "UPDATE_DRIVER_LOCATION",
            payload: updatedLocation,
        });
    }catch (err) {
        res.status(500).send(err.message);
    }
})

module.exports = router;