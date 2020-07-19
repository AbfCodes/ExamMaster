const express = require('express')
const { signup, login, protect } = require('../controllers/auth')
const { userData, updateScores } = require('../controllers/user')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.get('/userdata', protect, userData)
router.patch('/userdata/updateScores', protect, updateScores)
// router.post('/users', createUser)

module.exports = router
