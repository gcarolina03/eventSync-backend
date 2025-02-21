const router = require('express').Router()
const { checkAuth } = require('../../middlewares/auth') 
const { showProfile, editProfile } = require('../controllers/profile.controller')
const myServicesRouter = require('./myservice.router')
const upload = require("../../middlewares/upload_files");

router.get('/', checkAuth, showProfile)
router.put("/", checkAuth, upload.single('avatar'), editProfile);
router.use('/services', myServicesRouter)

module.exports = router