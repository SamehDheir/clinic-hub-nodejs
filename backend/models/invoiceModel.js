const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      description: String,
      quantity: Number,
      unitPrice: Number,
      total: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "online"],
    default: "cash",
  },
  issuedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
