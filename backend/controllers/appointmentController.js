const mongoose = require("mongoose");
const Appointment = require("../models/appointmentModel");
const {
  validateCreateAppointment,
  validateUpdateAppointment,
} = require("../validation/appointmentValidation");

// Create appointment
exports.createAppointment = async (req, res, next) => {
  try {
    const { error, value } = validateCreateAppointment(req.body);
    if (error) {
      const errors = error.details.map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    let doctorId, patientId;

    if (req.user.role === "doctor") {
      doctorId = req.user.id;
      patientId = value.patientId;
    } else if (req.user.role === "patient") {
      doctorId = value.doctorId;
      patientId = req.user.id;
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const appointment = new Appointment({
      doctorId,
      patientId,
      clinicId: req.user.clinicId,
      date: value.date,
      reason: value.reason || "",
      status: "scheduled",
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (err) {
    next(err);
  }
};

// Get all appointment
exports.getAppointments = async (req, res, next) => {
  try {
    const { doctorId, status } = req.query;

    const query = {
      clinicId: req.user.clinicId,
    };

    if (doctorId) query.doctorId = doctorId;
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate("doctorId", "name")
      .populate("patientId", "name")
      .sort({ date: 1 });

    res.status(200).json({ message: "Appointments fetched", appointments });
  } catch (err) {
    next(err);
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const appointment = await Appointment.findById(id)
      .populate("doctorId", "name")
      .populate("patientId", "name");

    if (
      !appointment ||
      appointment.clinicId.toString() !== req.user.clinicId?.toString()
    ) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ appointment });
  } catch (err) {
    next(err);
  }
};

// Update appointment
exports.updateAppointment = async (req, res, next) => {
  try {
    const { error, value } = validateUpdateAppointment(req.body);
    if (error) {
      const errors = error.details.map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { id } = req.params;
    const { date, reason, status } = req.body;

    const appointment = await Appointment.findById(id);
    if (
      !appointment ||
      appointment.clinicId.toString() !== req.user.clinicId?.toString()
    ) {
      return res
        .status(404)
        .json({ message: "Appointment not found or unauthorized" });
    }

    if (date) appointment.date = date;
    if (reason) appointment.reason = reason;
    if (status) appointment.status = status;

    await appointment.save();

    res.status(200).json({ message: "Appointment updated", appointment });
  } catch (err) {
    next(err);
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (
      !appointment ||
      appointment.clinicId.toString() !== req.user.clinicId?.toString()
    ) {
      return res
        .status(404)
        .json({ message: "Appointment not found or unauthorized" });
    }

    await appointment.deleteOne();

    res.status(200).json({ message: "Appointment deleted" });
  } catch (err) {
    next(err);
  }
};
