const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
const auth = require("../middleware/auth");

router.get("/", auth, (req, res, next) => {
  carController
    .getAll()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => next(error));
});

router.post("/create", (req, res, next) => {
  const carData = req.body; // Assuming the data for creating a new car is sent in the request body

  carController
    .createCar(carData)
    .then((createdCar) => {
      res
        .status(200)
        .json({ message: "Car created successfully", car: createdCar });
    })
    .catch((error) => next(error));
});

module.exports = router;
