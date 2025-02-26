const { default: mongoose } = require("mongoose");
const Request = require("../models/request.model");
const Service = require("../models/service.model");
const Event = require("../models/event.model");
const User = require("../models/user.model");

const createRequest = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const { serviceId, eventId } = req.body;

    // Check if the service exists
    const service = await Service.findById(serviceId).session(session);
    if (!service) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Check if the event exists
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check for an existing request
    const existingRequest = await Request.findOne({ serviceId, eventId }).session(session);
    if (existingRequest) {
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        requestId: existingRequest._id,
      });
    }

    // Create and save a new request
    const request = new Request(req.body);
    await request.save({ session });

    // Add the request to the event's eventRequests array
    event.eventRequests.push(request._id);
    await event.save({ session });

    // Crear la notificación para el propietario del servicio
    // Aquí asumimos que el propietario del servicio (service.userId) debe ser notificado
    const notification = new Notification({
      userId: service.userId,
      message: "newRequest",
      data: {
        requestId: request._id,
        event: {
          _id: event._id,
          title: event.title,
        },
        service: {
          _id: service._id,
          title: service.title,
        },
      },
      read: false,
    });
    await notification.save({ session });

    const io = req.app.get("io");
    if (io) {
      io.to(service.userId.toString()).emit("newNotification", notification);
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      request,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to save the request",
    });
  }
};

const getAllUserRequests = async (req, res) => {
  try {
    const { userId = res.locals.user.id } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const request = await Request.find()
      .populate({
        path: "eventId",
        populate: { path: "userId" },
      })
      .populate({
        path: "serviceId",
        populate: { path: "userId", match: { _id: req.body.userId } },
      })
      .sort({ date_of_request: -1 })
      .exec();

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to get requests",
    });
  }
};

const updateRequestState = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const { id } = req.params;
    const { state } = req.body;

    const request = await Request.findById(id).populate({
      path: "serviceId",
      populate: { path: "categoryId" },
    }).session(session);

    if (!request) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    //check if user log is owner of the service in the request
    if (res.locals.user.id != request.serviceId.userId.toString()) {
      await session.abortTransaction();
      session.endSession();

      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const event = await Event.findById(request.eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    let dataEvent = {};
    if (
      request.serviceId.categoryId.title == "Location" &&
      state == "confirmed"
    ) {
      dataEvent = {
        total_price: event.total_price + request.serviceId.price,
        img_url: request.serviceId.img_url,
      };
    } else if (state == "confirmed") {
      dataEvent = { total_price: event.total_price + request.serviceId.price };
    }

    // Update the event and request state
    await Event.updateOne({ _id: event._id }, dataEvent, { session });
    await Request.updateOne({ _id: request._id }, { state: req.body.state }, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to update requests",
    });
  }
};

module.exports = { createRequest, getAllUserRequests, updateRequestState };
