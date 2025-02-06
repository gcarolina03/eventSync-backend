const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const cloudinary = require("../../db/cloudinary");

const signup = async (req, res) => {
  const { email, password, first_name } = req.body;

  try {
		if (!email || !password || !first_name) {
      return res.status(400).json({
        success: false,
        message: "Email, password and first name are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password before saving
    const hashedPassword = bcrypt.hashSync(password, 10);
    req.body.password = hashedPassword;

    // Check if an avatar file was uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.img_url = result.secure_url;
    }

    // Create the new user
    const newUser = new User(req.body);
    await newUser.save();

    // Generate and return a JSON Web Token
    const token = generateToken(newUser.email);
    return res.status(201).json({
      success: true,
      token,
      user: newUser,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      error: err.message,
      message: "User not created!",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Search for the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate and return a JSON Web Token
    const token = generateToken(user.email);
    return res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      error: err.message,
      message: "Failed to login!",
    });
  }
};

const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = { signup, login };