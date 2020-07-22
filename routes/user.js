const express = require('express')

const {
  signup,
  login,
  protect,
  updatePassword,
} = require('../controllers/auth')
const {
  userData,
  insertScores,
  updateUserInfo,
  updateLevelScores,
  userScores,
  userScore,
  deleteUser,
} = require('../controllers/user')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.patch('/updatePassword', protect, updatePassword)

// get all user data
router.get('/userdata', protect, userData)

router.get(
  '/userscore/:language/:userClass/:subject/:level',
  protect,
  userScore
)
router.get('/userscores/:language/:userClass/:subject', protect, userScores)

router.put('/insertLevel', protect, insertScores)
router.patch(
  '/updateLevelScores/:language/:userClass/:subject/:level',
  protect,
  updateLevelScores
)
router.patch('/updateUserInfo', protect, updateUserInfo)
router.delete('/deleteAccount', protect, deleteUser)
// router.delete('/delete/:id', protect, deleteUser)

module.exports = router
