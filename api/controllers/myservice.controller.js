const Service = require('../models/service.model')
const User = require('../models/user.model')
const cloudinary = require('../../db/cloudinary')


const createService = async (req, res) => {
  try {
    if(!req.body.userId) { req.body.userId = res.locals.user.id }
    // Check if the user exists
    const user = await User.findById(req.body.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

     // Check if an avatar file was uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      req.body.img_url = result.secure_url;
    }

    if(req.body.categoryId !== '64ac73ab173c1b223d20f928') {
      delete req.body.max_capacity
      delete req.body.min_capacity
      delete req.body.start_time
      delete req.body.end_time
    }

    // Create a new service
    const service = new Service(req.body)
    await service.save()

    // Add the service to the user's servicesCreated array
    user.servicesCreated.push(service._id);
    await user.save()

    return res.status(200).json({ service })
  } catch (err) {
    return res.status(500).json({ err, message: 'Service not created' })
  }
}

const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ err, message: 'Service not found' })
    //check if user log is owner of the event
    if(res.locals.user.id !== service.userId.toString()) return res.status(500).json('Unauthorized')

    return res.status(200).json({ service })
  } catch (err) {
    return res.status(500).json({err, message: 'Service not found!'})
  }
}

const getAllUserService = async (req, res) => {
  try {
    // Find all services of the specified user
    const services = await Service
                      .find({ userId: res.locals.user.id })
                      .populate('categoryId')
                      .populate('serviceReviews', 'thumb userId')
                      .exec();
    return res.status(200).json({ success: true, data: services })
  } catch (err) {
    return res.status(500).json({ err, message: 'Services not found' })
  }
}

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ error: 'Service not found' })
    //check if user log is owner of the service
    if(res.locals.user.id !== service.userId.toString()) return res.status(500).json('Unauthorized')

    await Service.deleteOne({ _id: service._id})
    return res.status(200).json({ message: 'Service deleted successfully' })
  } catch (err) {
    return res.status(500).json({ err, message: 'Failed to delete service' })
  }
}

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ error: 'Service not found' })
  
    //check if user log is owner of the service
    if(res.locals.user.id !== service.userId.toString()) return res.status(500).json('Unauthorized')
    
    // Check if an avatar file was uploaded
    if (req.file) {
      req.body.img_url = req.file.path;
    }

    await Service.updateOne({ _id: service._id }, req.body)

    return res.status(200).json({ message: 'Service updated successfully' })
  } catch (err) {
    return res.status(500).json({ err, message: 'Failed to update service' });
  }
}

module.exports = { createService, getService, getAllUserService, deleteService, updateService }