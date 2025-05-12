const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  githubId: String,
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  age: { type: Number, required: true },
  birthdayDate: { type: Date, required: true },
  picture: { type: String },
  avatar: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  numberOfCourse: { type: Number, default: 0 },
  role: {
    type: String,
    enum: ["admin", "user", "professor", "entreprise"],
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    default: "user", // ⚠️ 'user' is not part of enum; consider default: 'male'
    required: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  isVerified: { type: Boolean, default: false },
  is2FAEnabled: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  otp: String,
  otpExpiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
