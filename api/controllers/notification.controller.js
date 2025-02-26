const { default: mongoose } = require("mongoose");
const Notification = require("../models/notification.model");
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

const getLatestNotifications = async (req, res) => {
  const userId = req.params.userId || res.locals.user?.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);  

    return res.status(200).json({
      success: true,
      notifications
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      error: err.message,
      message: "Error fetching latest notifications"
    });
  }
}
const getAllNotifications = async (req, res) => {
  const userId = req.params.userId || res.locals.user?.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found"
      });
    }

    const total = await Notification.countDocuments({ userId });
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      notifications,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
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
  getLatestNotifications,
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
};