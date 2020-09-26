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
  verifyOtp,
  googleController,
  facebookController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/Auth.controller");

router
  .get("/sendotp", sendOtp)
  .get("/verifyotp", verifyOtp)
  .post("/register", validSign, registerController)
  .post("/activation", activationController)
  .post("/login", validLogin, signinController)
  .post("/googlelogin", googleController)
  .post("/facebooklogin", facebookController)
  .put("/forgotpassword", forgotPasswordValidator, forgotPasswordController)
  .put("/resetpassword", resetPasswordValidator, resetPasswordController);

module.exports = router;
