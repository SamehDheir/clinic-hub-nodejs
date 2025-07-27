const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  department: {
    type: String,
  },
  notes: {
    type: String,
  },
  diagnosis: {
    type: String,
  },
  prescription: {
    type: String,
  },
  attachments: {
    type: [String],
    default: [],
  },
});

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    allergies: {
      type: [String],
      default: [],
    },
    chronicDiseases: {
      type: [String],
      default: [],
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    visits: {
      type: [visitSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
