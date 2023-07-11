const Event = require('../models/event.model')
const User = require('../models/user.model')

const createEvent = async (req, res) => {
  try {
    if(!req.body.userId) { req.body.userId = res.locals.user.id }
    // Check if the user exists
    const user = await User.findById(req.body.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Create a new event
    const event = new Event(req.body)
    await event.save()

    // Add the event to the user's eventsCreated array
    user.eventsCreated.push(event._id);
    await user.save()

    return res.status(200).json({ event })
  } catch (err) {
    return res.status(500).json({ err, message: 'Event not created' })
  }
}

const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    //check if user log is owner of the event
    if(res.locals.user.id !== event.userId.toString()) return res.status(500).json('Unauthorized')

    if (!event) return res.status(404).json({ err, message: 'Event not found' })

    return res.status(200).json({ event })
  } catch (err) {
    return res.status(500).json({err, message: 'Event not found!'})
  }
}

const getAllUserEvents = async (req, res) => {
  try {
    // Find all events of the specified user
    const events = await Event.find({ userId: res.locals.user.id });

    return res.status(200).json({ success: true, data: events })
  } catch (error) {
    return res.status(500).json({ err, message: 'Events not found' })
  }
}

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ error: 'Event not found' })
    //check if user log is owner of the event
    if(res.locals.user.id !== event.userId.toString()) return res.status(500).json('Unauthorized')

    await Event.deleteOne({ _id: event._id})
    return res.status(200).json({ message: 'Event deleted successfully' })
  } catch (err) {
    return res.status(500).json({ err, message: 'Failed to delete event' })
  }
}

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ error: 'Event not found' })
  
    //check if user log is owner of the event
    if(res.locals.user.id !== event.userId.toString()) return res.status(500).json('Unauthorized')
    
    if( req.body.event_date ) delete req.body.event_date
    await Event.updateOne({ _id: event._id }, req.body)

    return res.status(200).json({ message: 'Event updated successfully' })
  } catch (err) {
    return res.status(500).json({ err, message: 'Failed to update event' });
  }
}

module.exports = { createEvent, getEvent, getAllUserEvents, deleteEvent, updateEvent }