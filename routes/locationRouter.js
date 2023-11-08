const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const auth = require('../middleware/auth');

router.get('/', auth,(req, res, next) => {
    
    locationController
        .getAll()
        .then(data => {
            res.send(data);
        })
        .catch(error => next(error));

});


module.exports = router;