const express = require('express');
const router = express.Router();
const bookingStatusController = require('../controllers/bookingStatus');
const auth = require('../middleware/auth');

router.get('/', auth,(req, res, next) => {
    
    bookingStatusController
        .getAll()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => next(error));

});

// Create a new car type
router.post('/', auth, (req, res, next) => {
    const newStatus = req.body; // Assuming the new data is sent in the request body

    bookingStatusController
        .addStatus(newStatus)
        .then(newstatus => {
            res.status(201).send(newstatus); // 201 Created status for successful creation
        })
        .catch(error => next(error));
});
router.put('/', auth, (req, res, next) => {
    const newStatus = req.body; // Assuming the new data is sent in the request body

    bookingStatusController
        .updateStatus(newStatus)
        .then(newstatus => {
            res.status(201).send(newstatus); // 201 Created status for successful creation
        })
        .catch(error => next(error));
});
router.delete('/delete/:statusId', (req, res) => {
    const statusIdToDelete = req.params.statusId;

    bookingStatusController.deleteStatus(statusIdToDelete)
        .then(message => res.status(200).json({ success: true, message }))
        .catch(error => res.status(400).json({ success: false, error: error.message }));
});
module.exports = router;