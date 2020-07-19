const express = require('express')
const { signup, login, protect } = require('../controllers/auth')
const {
  userData,
  updateScores,
  updateUserInfo,
  updateLevelScores,
} = require('../controllers/user')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/resetPassword', updateUserInfo)

// get all user data
router.get('/userdata', protect, userData)

router.put('/insertLevel', protect, updateScores)
router.patch('/updateLevelScores/:level/:language?', protect, updateLevelScores)
router.patch('/updateUserInfo', protect, updateUserInfo)
// router.post('/users', createUser)

module.exports = router
