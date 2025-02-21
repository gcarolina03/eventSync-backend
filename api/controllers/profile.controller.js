const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const cloudinary = require("../../db/cloudinary");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");

const showProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: res.locals.user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Error fetching user profile",
    });
  }
};

const editProfile = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = res.locals.user._id;

    if (!userId) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    if (req.body.first_name && req.body.first_name != '') {
      user.first_name = req.body.first_name;
    }

    if (req.body.last_name && req.body.last_name != "") {
      user.last_name = req.body.last_name;
    }

    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path);
      user.img_url = result.secure_url;
    }

    if (req.body.password && req.body.password != "") {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
			user.password = hashedPassword;
    }

		await user.save({ session });

		await session.commitTransaction();
		session.endSession();

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
		await session.abortTransaction();
		session.endSession();

    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Error updating user profile",
    });
  }
};

module.exports = { showProfile, editProfile };
