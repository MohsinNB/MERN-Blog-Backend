import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { validateEmail, validatePassword } from "../utils/validator.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if ((!firstName, !lastName, !email, !password)) {
      return res.status(400).json({
        success: false,
        message: "All field required",
      });
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return res
        .status(400)
        .json({ success: false, message: emailCheck.message });
    }

    // Validate password
    const passCheck = validatePassword(password);
    if (!passCheck.valid) {
      return res.status(400).json({ success: false, errors: passCheck.errors });
    }
    // res.status(200).json({ success: true, message: "Validation passed" });

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "Email already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    res.status(200).json({
      success: true,
      message: "user created successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const getUser = await User.findOne({ email });
    if (!getUser) {
      res.status(400).json({
        success: false,
        message: "user does not exist. You have to sign up first",
      });
    }
    const isPasswordMatched = await bcrypt.compare(password, getUser.password);
    if (!isPasswordMatched) {
      res.status(400).json({
        success: false,
        message: "wrong Password",
      });
    }

    const token = await jwt.sign(
      { userId: getUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
      })
      .json({
        success: true,
        message: `welcome back ${getUser.firstName}`,
        getUser,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login user",
    });
  }
};
export const logOut = async (__, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "logout successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateProfile = async (req, res) => {
  console.log("It's an hello from initial");
  try {
    const userId = req.id;
    const {
      firstName,
      occupation,
      lastName,
      bio,
      instagram,
      facebook,
      linkedin,
      github,
    } = req.body;
    console.log("it's from req.body");
    let cloudResponse = null;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // update data
    if (firstName) user.firstName = firstName;
    if (occupation) user.occupation = occupation;
    if (lastName) user.lastName = lastName;
    if (instagram) user.instagram = instagram;
    if (facebook) user.facebook = facebook;
    if (github) user.github = github;
    if (linkedin) user.linkedin = linkedin;
    if (bio) user.bio = bio;

    if (cloudResponse) {
      user.photoUrl = cloudResponse.secure_url;
    }
    console.log("cloud Response as cloudinary working");

    await user.save();
    console.log("user saved");
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};
