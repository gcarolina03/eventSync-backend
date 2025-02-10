const { default: mongoose } = require("mongoose");
const Service = require("../models/service.model");
const User = require("../models/user.model");
const cloudinary = require("../../db/cloudinary");

const isUserAuthorized = (userId, serviceUserId) => userId.toString() == serviceUserId.toString();

const createService = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      userId = res.locals.user.id,
      categoryId,
      ...serviceData
    } = req.body;

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

    // Handle file upload if present
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      serviceData.img_url = result.secure_url;
    }

    // Conditional deletion of certain fields based on categoryId
    if (categoryId != "64ac73ab173c1b223d20f928") {
      delete serviceData.max_capacity;
      delete serviceData.min_capacity;
      delete serviceData.start_time;
      delete serviceData.end_time;
    }

    // Create a new service
    const service = new Service(serviceData);
    await service.save({ session });

    // Add the service to the user's servicesCreated array
    user.servicesCreated.push(service._id);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      service,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Service not created",
    });
  }
};

const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Check if user is authorized (owner of the service)
    if (!isUserAuthorized(res.locals.user.id, service.userId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Service retrieval failed",
    });
  }
};

const getAllUserService = async (req, res) => {
  try {
    const services = await Service.find({ userId: res.locals.user.id })
      .populate("categoryId")
      .populate("serviceReviews", "thumb userId")
      .exec();

    return res.status(200).json({
      success: true,
      services,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to retrieve services",
    });
  }
};

const deleteService = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const service = await Service.findById(req.params.id).session(session);
    if (!service) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Check if user is authorized (owner of the service)
    if (!isUserAuthorized(res.locals.user.id, service.userId)) {
      await session.abortTransaction();
      session.endSession();

      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Service.deleteOne({ _id: service._id }, { session });

    await User.updateOne(
      { _id: service.userId },
      { $pull: { servicesCreated: service._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to delete service",
    });
  }
};

const updateService = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const service = await Service.findById(req.params.id).session(session);
    if (!service) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Check if user is authorized (owner of the service)
    if (!isUserAuthorized(res.locals.user.id, service.userId)) {
      await session.abortTransaction();
      session.endSession();

      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Handle file upload if present
    if (req.file) {
      req.body.img_url = req.file.path;
    }

    await Service.updateOne({ _id: service._id }, req.body, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to update service",
    });
  }
};

module.exports = {
  createService,
  getService,
  getAllUserService,
  deleteService,
  updateService,
};
