const mongoose = require("mongoose");

const ClinicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  email: String,
  subscriptionPlan: {
    type: String,
    enum: ["basic", "pro", "enterprise"],
    default: "basic",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Clinic", ClinicSchema);
