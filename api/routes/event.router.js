const router = require('express').Router()
const { checkAuth } = require('../../middlewares/auth') 
const { createEvent, getEvent, getAllUserEvents, deleteEvent, updateEvent } = require('../controllers/event.controller')

router.get('/', checkAuth, getAllUserEvents)
router.get('/:id', checkAuth, getEvent)

router.post('/', checkAuth, createEvent)

router.delete('/:id', checkAuth, deleteEvent)

router.put('/:id', checkAuth, updateEvent)

module.exports = router