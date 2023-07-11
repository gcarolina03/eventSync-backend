const router = require('express').Router()
const { createService, getService, getAllUserService, deleteService, updateService } = require('../controllers/myservice.controller')
const { checkAuth } = require('../../middlewares/auth') 
const upload = require('../../middlewares/upload_files')

router.get('/', checkAuth, getAllUserService)
router.get('/:id', checkAuth, getService)

router.post('/', checkAuth, upload.single('avatar'), createService)

router.delete('/:id', checkAuth, deleteService)

router.put('/:id', checkAuth, updateService)

module.exports = router