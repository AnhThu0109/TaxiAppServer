let models = require('../models');
let Driver = models.Driver;

const driverMiddleware = {
    driverExists: async (req, res, next) => {
      const {
        params: { id },
      } = req;
      const driver = await Driver.findByPk(id);
      if (!driver)
        return res.status(404).send({
          success: true,
          message: "Driver not found",
          driver,
        });
  
      req.oldDriver = driver;
      return next();
    },
  };
  
  module.exports = driverMiddleware;