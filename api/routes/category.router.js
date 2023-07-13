const router = require('express').Router()
const { createCategory, getCategories } = require('../controllers/category.controller')
const { checkAuth, checkAdmin } = require('../../middlewares/auth') 

router.post('/', checkAuth, checkAdmin, createCategory)
router.get('/', getCategories)

module.exports = router