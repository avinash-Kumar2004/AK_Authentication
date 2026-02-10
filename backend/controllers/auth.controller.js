import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";
import {sendVerificationEmail,sendWelcomeEmail,sendpasswordResetEmail,sendResetSuccessEmail} from "../mailtrap/emails.js";
export const signup = async (req, res) => {
  const { email, name, phone, dob, password, gender } = req.body;
  try {
    if (!email || !name || !phone || !dob || !password || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 character" });
    }
    if (phone.toString().length !== 10) {
      return res.status(400).json({ message: "Phone should be 10 digit" });
    }
    const userAlreadyExist = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });
    if (userAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exist" });
    }
    const hashpassword = await bcryptjs.hash(password, 11);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const normalizedGender = gender.toLowerCase();
    const user = new User({
      email,
      name,
      phone,
      password: hashpassword,
      dob,
      gender: normalizedGender,
      verificationToken,
      verificationTokenExpireAt: new Date(Date.now() + 15 * 60 * 1000), //15 minute ke liye valid
    });
    await user.save();

    //jwt token creat karna hia
    generateTokenAndSetCookies(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpireAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired Verification Code",
        });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpireAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Email Verify Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in verify Email:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const login = async (req, res) => {
  const { phone, email, password } = req.body;
  if (!email && !phone) {
    return res.status(400).json({
      success: false,
      message: "Email or phone is required",
    });
  }
  try {
    const query = [];
    if (email) query.push({ email: email.toLowerCase() });
    if (phone) query.push({ phone });

    const user = await User.findOne({ $or: query });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const isCorrectpassword = await bcryptjs.compare(password, user.password);
    if (!isCorrectpassword) {
      return res
        .status(400)
        .json({ success: false, message: "Enter Correct Password" });
    }

    generateTokenAndSetCookies(res, user._id);
    user.lastLogin = new Date();
    await user.save();
    res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in Login controller:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged Out Successfully" });
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }
    // reset token
    const resetToken = crypto.randomBytes(25).toString("hex");
    const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();
    await sendpasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`,
    );
    res
      .status(200)
      .json({ success: true, message: "Password Link sent to your Email" });
  } catch (error) {
    console.log("Error in Fogot Password:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if(!user){
        return res.status(400).json({success:false,message:"Invalid or expired reset token"})
    }
    const hashpassword = await bcryptjs.hash(password,11)
    user.password=hashpassword
    user.resetPasswordToken=undefined
    user.resetPasswordExpiresAt=undefined
  await  user.save()
  await sendResetSuccessEmail(user.email)
  res.status(200).json({success:true,message:"Password Reset Successfull"})
  } catch (error) {
    console.log('Error in resetPassword',error);
    res.status(400).json({success:false,message:error.message})
  }
};

export const checkAuth = async(req,res)=>{
  try {
    const user = await User.findById(req.userId).select("-password")
    if(!user){
        return res.status(400).json({success:false,message:"User not found"})
    }
    res.status(200).json({success:true,user})
  } catch (error) {
    console.log('Error in CheckAuth ',error);
    res.status(400).json({success:false,message:error.message})
  }  
}
// 45b237b0ae8a02cf480ead0c1ff65915
// cbff11b034a2e840cc4a17651b0221b2
