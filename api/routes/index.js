const router = require('express').Router()
const authRouter = require('./auth.router.js'); 
const profileRouter = require('./profile.router.js'); 

router.use('/auth', authRouter)
router.use('/profile', profileRouter)

module.exports = { router }