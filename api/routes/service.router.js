const router = require('express').Router()
const { getAllServices } = require('../controllers/service.controller')

router.get('/', getAllServices)

module.exports = router