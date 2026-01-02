import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/sendEmail.js";

// --------------- REGISTER --------------------//

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User Already Exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Sending Welcome Email ✨
    const subject = "Welcome to Closal ✨";
    const message = `Welcome to Closal Website. Your account has been created with email id: ${email}`;

    sendEmail(email, message, subject);

    return res.json({ success: true, user: { user } });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// --------------- LOGIN --------------------//
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email | !password) {
    return res.json({
      success: false,
      message: "Email and Password are required!",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Email!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, user: { user } });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// --------------- LOGOUT --------------------//
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// run after login or signup or if the token is in the cookie
// --------------- Send Veification OTP to the User's Email --------------------//
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account Already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 1 * 60 * 60 * 1000;

    await user.save();

    // Send OTP
    const email = user.email;
    const subject = "🔐 Account Verification OTP";
    const message = `Your OTP is ${otp}. Verify your account using this OTP.`;

    sendEmail(email, message, subject);

    res.json({ success: true, message: "Verification OTP Send on Email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// --------------- Verify Email --------------------//
export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id;

  if (!userId || !otp) {
    return res.status(400).json({
      success: false,
      message: "⚠️ Missing required details.",
    });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "🔍 User not found.",
      });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Invalid OTP. Please try again.",
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(410).json({
        success: false,
        message: "⚠️ OTP expired.",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = "";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "✅ Email verified successfully.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// --------------- Check if user is authenticated --------------------//
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// --------------- Send Password reset OTP --------------------//
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required!" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not Found!" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 10000;

    await user.save();

    // Sending Reset otp to email
    const subject = "🗝️ Password Reset Otp";
    const message = `Your OTP For resetting your password is ${otp} Use this OTP to process with resetting your password.`;

    sendEmail(email, message, subject);

    return res.json({ success: true, message: "OTP Sent to your email!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// --------------- Verify Otp and Reset Password --------------------//
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, Otp and new password is required.",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Not Found!" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP!" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = "";

    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
