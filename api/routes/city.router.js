const router = require('express').Router()
const { createCity, getCities } = require('../controllers/city.controller')
const { checkAuth, checkAdmin } = require('../../middlewares/auth') 

router.post('/', checkAuth, checkAdmin, createCity)
router.get('/', checkAuth, getCities)

module.exports = router