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
  signinController,
  sendOtp,
  verifyOtp
} = require("../controllers/AuthController");

router
  .get("/sendotp", sendOtp)
  .get("/veryfyotp",verifyOtp)
  .post("/register", validSign, registerController)
  .post("/activation", activationController)
  .post("/login", validLogin, signinController);

module.exports = router;
