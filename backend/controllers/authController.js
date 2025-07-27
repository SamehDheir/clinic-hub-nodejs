const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Regiter
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = createToken(newUser);
    res.status(201).json({
      user: { id: newUser._id, name: newUser.name, role: newUser.role },
      token,
    });
  } catch (err) {
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // User search
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Genarate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 number
    user.otpCode = otp;
    user.otpExpires = Date.now() + 1000 * 60 * 5; // Expire 5m
    await user.save();

    // Send the code via email
    await sendEmail(
      user.email,
      "ClinicHub - Your 2FA Verification Code",
      `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #4CAF50;">Two-Factor Authentication (2FA)</h2>
        <p>Hello ${user.name || ""},</p>
    
        <p>We received a login attempt that requires additional verification for your <strong>ClinicHub</strong> account.</p>
    
        <p>Please enter the following verification code:</p>
    
        <div style="
          font-size: 24px;
          font-weight: bold;
          background-color: #f0f0f0;
          padding: 15px;
          text-align: center;
          border-radius: 8px;
          margin: 20px 0;
          letter-spacing: 3px;
        ">
          ${otp}
        </div>
    
        <p>This code is valid for 5 minutes. If you didn’t request this, please ignore this email.</p>
    
        <p style="margin-top: 30px;">Best regards,<br/>ClinicHub Team</p>
      </div>
      `
    );

    res.status(200).json({ message: "Verification code sent to your email" });
  } catch (err) {
    next(err);
  }
};

// Verify 2FA
exports.verify2FA = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otpCode !== code || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
      return next(new Error("Invalid or expired verification code"));
    }

    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = createToken(user);
    res.json({
      message: "Logged in successfully",
      user: { id: user._id, name: user.name, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
};

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 min
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail(
      user.email,
      "ClinicHub - Reset your password",
      `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #4CAF50;">Reset your password</h2>
        <p>Hello ${user.name || ""},</p>
    
        <p>We received a request to reset your password for your <strong>ClinicHub</strong> account.</p>
        
        <p>Click the button below to reset your password:</p>
    
        <a href="${resetLink}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px 0;
        ">Reset Password</a>
    
        <p>If you didn’t request this, you can ignore this email. The link is valid for 1 hour only.</p>
    
        <p style="margin-top: 30px;">Best regards,<br/>ClinicHub Team</p>
      </div>
      `
    );

    res.status(200).json({ message: "Reset email sent" });
  } catch (err) {
    next(err);
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};
