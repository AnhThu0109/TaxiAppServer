let models = require('../models');
let Customer = models.Customer;

const customerMiddleware = {
    customerExists: async (req, res, next) => {
      const {
        params: { id },
      } = req;
      const customer = await Customer.findByPk(id);
      if (!customer)
        return res.status(404).send({
          success: false,
          message: "Customer not found",
          customer,
        });
  
      req.oldCustomer = customer;
      return next();
    },
  };
  
  module.exports = customerMiddleware;