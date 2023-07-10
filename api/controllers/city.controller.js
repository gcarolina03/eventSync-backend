const City = require('../models/city.model')

const createCity = async (req, res) => {
  try {
    // Create a new category
    const city = new City(req.body)
    await city.save()

    return res.status(200).json({ city })
  } catch (err) {
    return res.status(500).json({ err, message: 'City not created' })
  }
}

const getCities = async (req, res) => {
  try {
    const cities = await City.find()
    return res.status(200).json({ success: true, data: cities })
  } catch (err) {
    return res.status(500).json({ err, message: 'Cities not found' })
  }
}

module.exports = { createCity, getCities }