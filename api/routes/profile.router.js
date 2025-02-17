const router = require('express').Router()
const { checkAuth } = require('../../middlewares/auth') 
const { showProfile, editProfile } = require('../controllers/profile.controller')
const myServicesRouter = require('./myservice.router')

router.get('/', checkAuth, showProfile)
router.put("/", checkAuth, editProfile);
router.use('/services', myServicesRouter)

module.exports = router