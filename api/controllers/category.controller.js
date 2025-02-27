const { default: mongoose } = require("mongoose");
const Category = require("../models/category.model");

const createCategory = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { title } = req.body;

    if (!title) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const category = new Category(req.body);
    await category.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      category,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Category not created",
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      message: "Categories not found",
    });
  }
};

module.exports = { createCategory, getCategories };