const express = require("express");
const router = express.Router();
const {
  createPayment,
  getPayments,
  createStripeCheckoutSession,
} = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, createPayment);
router.post("/create-checkout-session", protect, createStripeCheckoutSession);
router.get("/", protect, getPayments);

module.exports = router;
