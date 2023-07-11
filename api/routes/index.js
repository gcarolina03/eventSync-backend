const router = require('express').Router()
const authRouter = require('./auth.router.js'); 
const profileRouter = require('./profile.router.js'); 
const eventRouter = require('./event.router.js'); 
const categoriesRouter = require('./category.router.js'); 
const citiesRouter = require('./city.router.js'); 

router.use('/auth', authRouter)
router.use('/profile', profileRouter)
router.use('/events', eventRouter)
router.use('/categories', categoriesRouter)
router.use('/cities', citiesRouter)

module.exports = { router }