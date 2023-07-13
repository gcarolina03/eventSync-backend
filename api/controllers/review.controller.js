const Review = require('../models/review.model')
const Service = require('../models/service.model')


// Create a new review
const createReview  = async (req, res) => {
  try {
    if(!req.body.userId) { req.body.userId = res.locals.user.id }
    
    // Check if the service exists
    const service = await Service.findById(req.body.serviceId)
    if (!service) return res.status(404).json({ error: 'Service not found' })

    // Find existing review for the user and service combination
    const existingReview = await Review.findOne({ serviceId: req.body.serviceId, userId: req.body.userId })

    if (existingReview) {
      return res.status(200).json({reviewId: existingReview._id})
    } else {
      // Create a new review instance
      const review = new Review(req.body)

      // Save the new review to the database
      await review.save()

      // Add the review to the service's serviceReview array
      service.serviceReviews.push(review._id)
      await service.save()

      res.status(200).json({ review })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to save the review' })
  }
}

const updateReview = async (req, res) => {
  try {
    await Review.updateOne({ _id: req.params.id }, {thumb: req.body.thumb})

    res.status(200).json({ message: 'Review updated successfully' })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update the review' })
  }
}


module.exports = { createReview, updateReview }