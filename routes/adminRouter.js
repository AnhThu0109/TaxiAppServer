const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.post('/register', adminController.register);
router.post('/login', adminController.login);
/*
router.get('/booking/:id', auth,(req, res, next) => {
    let bookingController = require('../controllers/bookingController');
    //console.log(req.params.id);
    bookingController
        .getByAdminId(req.params.id)
        .then(data => {
            res.send(data);
        })
        .catch(error => next(error));

});*/
module.exports = router;