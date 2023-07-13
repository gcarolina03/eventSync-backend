const router = require('express').Router()
const { createReview, updateReview } = require('../controllers/review.controller')
const { checkAuth } = require('../../middlewares/auth') 

router.post('/', checkAuth, createReview)

router.put('/:id', checkAuth, updateReview)

module.exports = router