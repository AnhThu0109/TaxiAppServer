const express = require('express');
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
router.post('/', auth, (req, res, next) => {
    const newService = req.body; // Assuming the new data is sent in the request body

    serviceController
        .addService(newService)
        .then(newservice => {
            res.status(201).send(newservice); // 201 Created status for successful creation
        })
        .catch(error => next(error));
});

module.exports = router;