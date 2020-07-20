const express = require('express')
const { signup, login, protect, resetPassword } = require('../controllers/auth')
const {
  userData,
  updateScores,
  updateUserInfo,
  updateLevelScores,
  userScores,
} = require('../controllers/user')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.patch('/resetPassword', resetPassword)

// get all user data
router.get('/userdata', protect, userData)
router.get(
  '/userscore/:language/:userClass/:subject/:level?',
  protect,
  userScores
)

router.put('/insertLevel', protect, updateScores)
router.patch('/updateLevelScores/:level/:language', protect, updateLevelScores)
router.patch('/updateUserInfo', protect, updateUserInfo)
// router.post('/users', createUser)

module.exports = router
