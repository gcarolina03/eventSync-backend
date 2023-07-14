const Request = require('../models/request.model')
const Service = require('../models/service.model')
const Event = require('../models/event.model')
const User = require('../models/user.model')

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
      await event.save()

      return res.status(200).json({ request })
    }
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save the request' })
  }
}

const getAllUserRequests  = async (req, res) => {
  try {
    if(!req.body.userId) { req.body.userId = res.locals.user.id }
    // Check if the user exists
    const user = await User.findById(req.body.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const request = await Request
                      .find()
                      .populate({
                        path: 'eventId',
                        populate: {
                          path: 'userId'
                        }
                      })
                      .populate({
                        path: 'serviceId',
                        populate: {
                          path: 'userId',
                          match: { _id: req.body.userId }
                        }
                      })
                      .sort({ date_of_request: -1 })
                      .exec();
    return res.status(200).json({ request })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get requests' })
  }
}

const updateRequestState = async (req, res) => {
  try {
    const request = await Request
      .findById(req.params.id)
      .populate({
        path: 'serviceId',
        populate: {
          path: 'categoryId'
        }
      })
    
    if (!request) return res.status(404).json({ error: 'Request not found' })
    
    //check if user log is owner of the service in the request
    if(res.locals.user.id !== request.serviceId.userId.toString()) return res.status(500).json('Unauthorized')
    
    const event = await Event.findById(request.eventId)
    if (!event) return res.status(404).json({ error: 'Event not found' })
    
    let dataEvent = {}
    console.log(request.serviceId.categoryId)
    if (request.serviceId.categoryId.title == 'Location' && req.body.state == 'confirmed') {
      dataEvent = { total_price: event.total_price + request.serviceId.price, img_url: request.serviceId.img_url }
      console.log(dataEvent)
    } else if (req.body.state == 'confirmed') {
      dataEvent = { total_price: event.total_price + request.serviceId.price }
      console.log(dataEvent)
    }
    console.log(req.body)

    const updatedEvent = await Event.updateOne({ _id: event._id }, dataEvent);
    console.log(updatedEvent);    
    await Request.updateOne({ _id: request._id }, {state: req.body.state})
    return res.status(200).json({ request })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update requests' })
  }
}


module.exports = { createRequest, getAllUserRequests, updateRequestState }