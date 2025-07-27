const express = require("express");
const router = express.Router();
const {
  register,
  login,
  resetPassword,
  forgotPassword,
  verify2FA,
} = require("../controllers/authController");
const { allowRoles } = require("../middlewares/roleMiddleware");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-2fa", verify2FA);

module.exports = router;
