const router = require('express').Router()
const authRouter = require('./auth.router.js'); 
const profileRouter = require('./profile.router.js'); 
const eventRouter = require('./event.router.js'); 
const categoriesRouter = require('./category.router.js'); 
const citiesRouter = require('./city.router.js'); 
const serviceRouter = require('./service.router.js'); 
const reviewsRouter = require('./review.router.js'); 
const requestRouter = require('./request.router.js'); 

router.use('/auth', authRouter)
router.use('/profile', profileRouter)
router.use('/events', eventRouter)
router.use('/categories', categoriesRouter)
router.use('/cities', citiesRouter)
router.use('/services', serviceRouter)
router.use('/reviews', reviewsRouter)
router.use('/requests', requestRouter)

module.exports = { router }