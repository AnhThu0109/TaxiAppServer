const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');

router.get('/', auth,(req, res, next) => {
    
    serviceController
        .getAll()
        .then(data => {
            res.send(data);
        })
        .catch(error => next(error));

});


module.exports = router;