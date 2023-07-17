const Service = require('../models/service.model')

const getAllServices = async (req, res) => {
  try {
    // Find all services
    const services = await Service
                      .find()
                      .populate('categoryId')
                      .populate('serviceReviews', 'thumb userId')
                      .exec();
    return res.status(200).json({ success: true, data: services })
  } catch (error) {
    return res.status(500).json({ err, message: 'Services not found' })
  }
}

module.exports = { getAllServices }