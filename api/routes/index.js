const router = require('express').Router()
const authRouter = require('./auth.router.js'); 
const profileRouter = require('./profile.router.js'); 
const eventRouter = require('./event.router.js'); 

router.use('/auth', authRouter)
router.use('/profile', profileRouter)
router.use('/events', eventRouter)

module.exports = { router }