const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/userModel");
const {
  validateAddClinicUser,
  validateUpdateClinicUser,
} = require("../validation/clinicUserValidation");

// Get Clinic User
exports.getClinicUsers = async (req, res, next) => {
  try {
    console.log("Current User:", req.user);

    const clinicId = req.user?.clinicId;

    if (!clinicId) {
      return res
        .status(400)
        .json({ message: "User is not assigned to any clinic" });
    }

    const users = await User.find({ clinicId }).select("-password");

    res.status(200).json({
      message: "Clinic users fetched successfully",
      users,
    });
  } catch (err) {
    next(err);
  }
};

// ِAdd clinic user
exports.addClinicUser = async (req, res, next) => {
  try {
    const { error, value } = validateAddClinicUser(req.body);
    if (error) {
      const errors = error.details.map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { name, email, password, role } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const clinicId = req.user?.clinicId;
    console.log(clinicId);

    if (!clinicId) {
      return res
        .status(400)
        .json({ message: "Admin is not linked to a clinic" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      clinicId,
    });

    res.status(201).json({
      message: "User added to clinic successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete clinic user
exports.deleteClinicUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Cannot delete itself
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    // Verify that the user is from the same clinic
    if (
      !user.clinicId ||
      user.clinicId.toString() !== req.user.clinicId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "User does not belong to your clinic" });
    }

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};
