const Review = require("../models/review.model");
const Service = require("../models/service.model");

// Create a new review
const createReview = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const { userId = res.locals.user.id, serviceId, thumb } = req.body;

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

    // Find existing review for the user and service combination
    const existingReview = await Review.findOne({ serviceId, userId }).session(session);
    if (existingReview) {
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        reviewId: existingReview._id,
      });
    }

    // Create a new review instance
    const review = new Review({ userId, serviceId, thumb });
    await review.save({ session });

    // Add the review to the service's serviceReview array
    service.serviceReviews.push(review._id);
    await service.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      review,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to save the review",
    });
  }
};

const updateReview = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const updatedReview = await Review.updateOne(
      { _id: req.params.id },
      { thumb: req.body.thumb },
      { session }
    );

    if (updatedReview.nModified == 0) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Review not found or no changes made",
      });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to update the review",
    });
  }
};

module.exports = { createReview, updateReview };
