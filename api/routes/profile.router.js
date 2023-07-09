const router = require('express').Router()
const { checkAuth } = require('../../middlewares/auth') 
const { showProfile } = require('../controllers/profile.controller')

router.get('/', checkAuth, showProfile)

module.exports = router