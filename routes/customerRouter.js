const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const auth = require("../middleware/auth");
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

module.exports = router;
