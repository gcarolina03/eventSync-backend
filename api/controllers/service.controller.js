const Service = require("../models/service.model");

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("categoryId")
      .populate("serviceReviews", "thumb userId")
      .exec();

    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to retrieve services",
    });
  }
};

module.exports = { getAllServices };
