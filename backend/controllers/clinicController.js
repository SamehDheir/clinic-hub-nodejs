const mongoose = require("mongoose");

const Clinic = require("../models/clinicModel");
const User = require("../models/userModel");
const {
  validateCreateClinic,
  validateUpdateClinic,
} = require("../validation/clinicValidation");

// Create Clinic
exports.createClinic = async (req, res, next) => {
  try {
    const { error, value } = validateCreateClinic(req.body);
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const existingClinic = await Clinic.findOne({
      $or: [{ name: value.name }, { email: value.email }],
    });

    if (existingClinic) {
      return res.status(409).json({
        message: "Clinic with the same name or email already exists",
      });
    }

    const clinic = new Clinic(value);
    await clinic.save();

    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user not authenticated" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.clinicId) {
      return res.status(403).json({
        message: "You are already assigned to a clinic",
      });
    }

    user.clinicId = clinic._id;
    console.log(user.clinicId);
    
    await user.save();

    res.status(201).json({
      message: "Clinic created successfully",
      clinic,
    });
  } catch (err) {
    console.error("Error creating clinic:", err);
    next(err);
  }
};

// Get all clinics
exports.getAllClinics = async (req, res, next) => {
  try {
    const clinics = await Clinic.find();
    res.status(200).json({ message: "Clinics fetched successfully", clinics });
  } catch (err) {
    next(err);
  }
};

// Get clinic
exports.getClinicById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid clinic ID format" });
    }

    const clinic = await Clinic.findById(id);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    res.status(200).json({ message: "Clinic fetched successfully", clinic });
  } catch (err) {
    next(err);
  }
};

// Update clinic
exports.updateClinic = async (req, res, next) => {
  try {
    const { error, value } = validateUpdateClinic(req.body);
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const clinic = await Clinic.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    res.status(200).json({ message: "Clinic updated successfully", clinic });
  } catch (err) {
    next(err);
  }
};

// Delete clinic
exports.deleteClinic = async (req, res, next) => {
  try {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    res.status(200).json({ message: "Clinic deleted successfully" });
  } catch (err) {
    next(err);
  }
};
