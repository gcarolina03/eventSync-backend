const router = require('express').Router()
const { createRequest, getAllUserRequests, updateRequestState } = require('../controllers/request.controller')
const { checkAuth } = require('../../middlewares/auth') 

router.post('/', checkAuth, createRequest)

router.get('/', checkAuth, getAllUserRequests)

router.put('/:id', checkAuth, updateRequestState)

module.exports = router