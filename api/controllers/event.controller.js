const { default: mongoose } = require("mongoose");
const Event = require("../models/event.model");
const User = require("../models/user.model");

const isUserAuthorized = (userId, eventUserId) => userId.toString() == eventUserId.toString();

const createEvent = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { userId = res.locals.user.id, ...eventData } = req.body;

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

    // Create a new event
    const event = new Event({ userId, ...eventData});
    await event.save({ session });

    // Add the event to the user's eventsCreated array
    user.eventsCreated.push(event._id);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      event,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Event not created",
    });
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate({
        path: "eventRequests",
        populate: {
          path: "serviceId",
          populate: {
            path: "categoryId",
          },
        },
      })
      .exec();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is authorized (owner of the event)
    if (!isUserAuthorized(res.locals.user.id, event.userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to retrieve event",
    });
  }
};

const getAllUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: res.locals.user.id })
      .populate({
        path: "eventRequests",
        populate: {
          path: "serviceId",
          populate: {
            path: "categoryId",
          },
        },
      })
      .exec();
      
    return res.status(200).json({
      success: true,
      events,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to retrieve events",
    });
  }
};

const deleteEvent = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const event = await Event.findById(req.params.id).session(session);
    if (!event) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is authorized (owner of the event)
    if (!isUserAuthorized(res.locals.user.id, event.userId)) {
      await session.abortTransaction();
      session.endSession();

      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Event.deleteOne({ _id: event._id }, { session });

    await User.updateOne(
      { _id: event.userId },
      { $pull: { eventsCreated: event._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to delete event",
    });
  }
};

const updateEvent = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const event = await Event.findById(req.params.id).session(session);
    if (!event) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is authorized (owner of the event)
    if (!isUserAuthorized(res.locals.user.id, event.userId)) {
      await session.abortTransaction();
      session.endSession();

      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.body.event_date) {
      delete req.body.event_date;
    }

    await Event.updateOne({ _id: event._id }, req.body, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to update event",
    });
  }
};

const addGuestToList = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const event = await Event.findById(req.params.id).session(session);
    if (!event) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if user is authorized (owner of the event)
    if (!isUserAuthorized(res.locals.user.id, event.userId)) {
      await session.abortTransaction();
      session.endSession();

      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.body._id = new mongoose.Types.ObjectId();
    req.body.number = req.body.number || 1;

    event.guestList.push(req.body);
    await event.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Event guest list updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to update guest list",
    });
  }
};

const removeGuestFromList = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });

    // Check if user is authorized (owner of the event)
    if (!isUserAuthorized(res.locals.user.id, event.userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const guestId = req.params.guestId;
    event.guestList.pull({ _id: guestId }); // Remove the guest from the guestList array
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event guest list updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to update event guest list",
    });
  }
};

module.exports = {
  createEvent,
  getEvent,
  getAllUserEvents,
  deleteEvent,
  updateEvent,
  addGuestToList,
  removeGuestFromList,
};
