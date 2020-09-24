const router = require('express').Router()
const authControler = require('../controllers/AuthController')

router.post('/register',authControler.registerUser)

module.exports = router