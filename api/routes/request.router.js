const router = require('express').Router()
const { createRequest } = require('../controllers/request.controller')
const { checkAuth } = require('../../middlewares/auth') 

router.post('/', checkAuth, createRequest)

module.exports = router