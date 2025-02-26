const { default: mongoose } = require("mongoose");
const Notification = require("../models/Notification");
const User = require("../models/user.model");
const e = require("express");

const createNotification = async (req, res) => {
  const { userId, message, data } = req.body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if the user exists
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
  
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const notification = new Notification({ userId, message, data })
    await notification.save({ session })

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      notification
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Error creating notification",
    });
  }
};

const getNotificationsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found"
      });
    }

    const notifications = await Notification
      .find({ userId })
      .sort({ createdAt: -1, });

    return res.status(200).json({
      success: true,
      notifications
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      error: err.message,
      message: "Error fetching notifications"
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  const notificationId = req.params.id;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true },
      { session }
    );

    if (!notification) {
      return res.status(404).json({
        success: false, 
        message: "Notification not found"
      });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ 
      success: true,
      notification 
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false, 
      error: err.message,
      message: "Error marking notification as read"
    });
  }
};

const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const notification = await Notification.findByIdAndDelete(notificationId, { session });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found" });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true, 
      message: "Notification deleted successfully"
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Error deleting notification" });
  }
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  deleteNotification,
};