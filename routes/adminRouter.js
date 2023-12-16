const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { query } = require('express-validator');

router.post('/register', adminController.register);
router.get('/all', auth, adminController.getAllAdmins);
router.post('/login', adminController.login);
router.get('/:adminId', adminController.getAdminById);
router.put('/:adminId', auth, adminController.updateAdmin);
router.get('/search', [
    query('keyword').isString().notEmpty()
], auth, adminController.searchAdminByFullName);
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