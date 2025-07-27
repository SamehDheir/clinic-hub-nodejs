// models/paymentModel.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "insurance"],
    required: true,
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
    required: true,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
