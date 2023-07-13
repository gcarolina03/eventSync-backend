const Request = require('../models/request.model')
const Service = require('../models/service.model')
const Event = require('../models/event.model')


// Create a new review
const createRequest  = async (req, res) => {
  try {    
    // Check if the service exists
    const service = await Service.findById(req.body.serviceId)
    if (!service) return res.status(404).json({ error: 'Service not found' })

    // Check if the event exists
    const event = await Event.findById(req.body.eventId)
    if (!event) return res.status(404).json({ error: 'Event not found' })

    // Find existing review for the user and service combination
    const existingRequest = await Request.findOne({ serviceId: req.body.serviceId, eventId: req.body.eventId })

    if (existingRequest) {
      return res.status(200).json({requestId: existingRequest._id})
    } else {
      // Create a new review instance
      const request = new Request(req.body)

      // Save the new review to the database
      await request.save()

      // Add the request to the event's eventRequests array
      event.eventRequests.push(request._id)
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