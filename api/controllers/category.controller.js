const Category = require('../models/category.model')

const createCategory = async (req, res) => {
  try {
    // Create a new category
    const category = new Category(req.body)
    await category.save()

    return res.status(200).json({ category })
  } catch (err) {
    return res.status(500).json({ err, message: 'Category not created' })
  }
}

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
    return res.status(200).json({ success: true, data: categories })
  } catch (err) {
    return res.status(500).json({ err, message: 'Categories not found' })
  }
}

module.exports = { createCategory, getCategories }
