const express = require("express");
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');

router.get('/', auth,(req, res, next) => {
    
    serviceController
        .getAll()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => next(error));
});


router.post("/create", auth, (req, res, next) => {
  const serviceData = req.body;
  serviceController
    .createService(serviceData)
    .then((createdService) => {
      res
        .status(200)
        .json({
          message: "Service created successfully",
          service: createdService,
        });
    })
    .catch((error) => next(error));
});

module.exports = router;
