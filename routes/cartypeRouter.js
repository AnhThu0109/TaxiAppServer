const express = require('express');
const router = express.Router();
const cartypeController = require('../controllers/cartypeController');
const auth = require('../middleware/auth');

router.get('/', auth,(req, res, next) => {
    
    cartypeController
        .getAll()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => next(error));

});

// Create a new car type
router.post('/', auth, (req, res, next) => {
    const newCarTypeData = req.body; // Assuming the new data is sent in the request body

    cartypeController
        .addCarType(newCarTypeData)
        .then(newCarType => {
            res.status(201).send(newCarType); // 201 Created status for successful creation
        })
        .catch(error => next(error));
});

module.exports = router;