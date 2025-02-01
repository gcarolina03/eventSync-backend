const Review = require("../models/review.model");
const Service = require("../models/service.model");

// Create a new review
const createReview = async (req, res) => {
  try {
    const { userId = res.locals.user.id, serviceId, thumb } = req.body;

    // Check if the service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Find existing review for the user and service combination
    const existingReview = await Review.findOne({ serviceId, userId });
    if (existingReview) {
      return res.status(200).json({
        success: true,
        reviewId: existingReview._id,
      });
    }

    // Create a new review instance
    const review = new Review({ userId, serviceId, thumb });
    await review.save();

    // Add the review to the service's serviceReview array
    service.serviceReviews.push(review._id);
    await service.save();

    return res.status(201).json({
      success: true,
      review,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to save the review",
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.updateOne(
      { _id: req.params.id },
      { thumb: req.body.thumb }
    );

    if (updatedReview.nModified == 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found or no changes made",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to update the review",
    });
  }
};

module.exports = { createReview, updateReview };
