const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const auth = require("../middleware/auth");
const customerMiddleware = require("../middleware/customermiddleware");
const { query } = require("express-validator");

router.get(
  "/search",
  [query("keyword").isString().notEmpty()],
  auth,
  customerController.findAllCustomersByTelKeyword
);
router.post("/register", customerController.register);
router.post("/login", customerController.login);
router.get("/", auth, customerController.findAllCustomers);
router.get("/:id", auth, customerController.findCustomerById);
router.put("/updatecustomerinfo/:id", auth, customerMiddleware.customerExists, async (req, res, next) => {
  const {body, params:{id}, oldCustomer} = req;
  console.log("oldDriver: "+ oldCustomer.id);
  console.log("id: "+id);
  try {
      
      if (id != oldCustomer.id) {
          res.status(403).send({
              success: false,
              message: "You are not authorized to carry out this action",
          })
          return;
      }
      let customerUpdate = await customerController.updateCustomerInfo(req);
      res.status(200).send({
          success: true,
          message: "Cập nhật thành công",
          data: customerUpdate});
  } catch (err){
      console.log(err.message);
      res.status(400).send("Error"+ err.message);
  }
})

module.exports = router;
