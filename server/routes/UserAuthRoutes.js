const { route } = require('../app')

const router = require('express').Router()
const userAuth = require('../controllers/AuthController')

router
.get('/userlist',userAuth.userList)
.post('/signup',userAuth.signUp)


module.exports = router