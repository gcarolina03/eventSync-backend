const router = require('express').Router()
const { checkAuth } = require('../../middlewares/auth') 
const { createEvent, getEvent, getAllUserEvents, deleteEvent, updateEvent, addGuestToList, RemoveGuestFromList} = require('../controllers/event.controller')

router.get('/', checkAuth, getAllUserEvents)
router.get('/:id', checkAuth, getEvent)

router.post('/', checkAuth, createEvent)

router.delete('/:id', checkAuth, deleteEvent)
router.delete('/:id/guest/:guestId', checkAuth, RemoveGuestFromList)

router.put('/:id', checkAuth, updateEvent)
router.put('/guest/:id', checkAuth, addGuestToList)

module.exports = router