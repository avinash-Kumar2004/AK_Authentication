import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"],
    },

    dob: {
      type: Date,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpireAt: Date,
  },
  { timestamps: true },
);
export const User = mongoose.model("User", userSchema);
