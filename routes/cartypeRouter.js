const express = require('express');
const router = express.Router();
const cartypeController = require('../controllers/cartypeController');
const auth = require('../middleware/auth');

router.get('/', auth,(req, res, next) => {
    
    cartypeController
        .getAll()
        .then(data => {
            res.send(data);
        })
        .catch(error => next(error));

});


module.exports = router;