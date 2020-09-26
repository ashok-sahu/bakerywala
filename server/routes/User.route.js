const router = require("express").Router();
const {
  readController,
  updateController,
} = require("../controllers/User.controller");
const { requireSignin } = require("../controllers/Auth.controller");

router
  .get("/user/:id", requireSignin, readController)
  .put("/user/update", requireSignin, updateController);
// .put('/admin/update', requireSignin, adminMiddleware, updateController);

module.exports = router;
