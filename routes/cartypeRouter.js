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
router.put("/update/:id", async (req, res, next) => {
    const id = req.params.id;
    const updatedData = req.body; // The updated data provided in the request body
  
    try {
      const updatedCarType =
        await cartypeController.updateCarType(
          id,
          updatedData
        );
      res.status(200).json(updatedCarType);
    } catch (error) {
      next(error);
    }
  });
  router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    cartypeController.deleteCarType(id)
    .then(message => res.status(200).json({ success: true, message }))
    .catch(error => res.status(400).json({ success: false, error: error.message }));
  })
module.exports = router;