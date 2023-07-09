const router = require('express').Router()
const { signup, login } = require('../controllers/auth.controller')
const upload = require('../../middlewares/upload_files')

router.post('/signup', upload.single('avatar'), signup)
router.post('/login', login)

module.exports = router