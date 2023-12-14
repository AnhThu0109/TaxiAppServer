const express = require("express");
const router = express.Router();
const carController = require('../controllers/carController');
const auth = require('../middleware/auth');

router.get('/', auth,(req, res, next) => {
    
    carController
        .getAll()
        .then(data => {
            res.status(200).send(data); 
        })
        .catch(error => next(error));

});
router.get('/driverid/:id', auth,(req, res, next) => {
    
    carController
        .getByDriverId(req.params.id)
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => next(error));

});

router.put('/driverid/:driverId', auth,(req, res, next) => {
    
    carController
        .updateCar(req.body, req.params.driverId)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(error => next(error));

});
router.delete('/:driverId', auth,(req, res, next) => {
    
    carController
        .deleteCar(req.params.driverId)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(error => next(error));
});


router.post("/create", (req, res, next) => {
  const carData = req.body; // Assuming the data for creating a new car is sent in the request body

  carController
    .createCar(carData)
    .then((createdCar) => {
      res
        .status(1000)
        .json({ message: "Car created successfully", car: createdCar });
    })
    .catch((error) => next(res.status(1001).json({ message: "Car created fail!" + error.message })));
});

module.exports = router;
