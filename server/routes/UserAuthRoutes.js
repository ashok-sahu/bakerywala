const router = require("express").Router();
const {
  forgotPasswordValidator,
  validLogin,
  validSign,
  resetPasswordValidator,
} = require("../helpers/valid");
const {
  registerController,
  activationController,
  signinController
} = require("../controllers/AuthController");

router
  .post("/register", validSign, registerController)
  .post("/activation", activationController)
  .post('/login',validLogin,signinController)

module.exports = router;
