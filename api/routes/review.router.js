const router = require('express').Router()
const { createReview, updateReview } = require('../controllers/review.controller')

router.post('/', createReview)

router.put('/:id', updateReview)

module.exports = router