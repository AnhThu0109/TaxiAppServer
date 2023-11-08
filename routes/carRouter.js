const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const auth = require('../middleware/auth');

router.get('/', auth,(req, res, next) => {
    
    carController
        .getAll()
        .then(data => {
            res.send(data);
        })
        .catch(error => next(error));

});


module.exports = router;