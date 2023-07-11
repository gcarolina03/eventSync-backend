const router = require('express').Router()
const { checkAuth } = require('../../middlewares/auth') 
const { showProfile } = require('../controllers/profile.controller')
const myServicesRouter = require('./myservice.router')

router.get('/', checkAuth, showProfile)
router.use('/services', myServicesRouter)

module.exports = router