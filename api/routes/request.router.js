const router = require('express').Router()
const { createRequest, getAllUserRequests } = require('../controllers/request.controller')
const { checkAuth } = require('../../middlewares/auth') 

router.post('/', checkAuth, createRequest)

router.get('/', checkAuth, getAllUserRequests)

module.exports = router