const express = require('express')

const {
  signup,
  login,
  protect,
  restrictTo,
  updatePassword,
  forgotPassword,
  resetPassword,
  AuthorizedSignup,
} = require('../controllers/auth')
const {
  userData,
  insertScores,
  updateUserInfo,
  uploadUserProfilesImage,
  updateLevelScores,
  userScores,
  userScore,
  getAllUsers,
  deleteUser,
} = require('../controllers/user')

const router = express.Router()

router.post('/signup', signup)
router.post(
  '/AuthorizedSignup',
  protect,
  restrictTo('system admin'),
  AuthorizedSignup
)
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
router.get(
  '/getAllUsers',
  protect,
  restrictTo('system admin', 'system manager'),
  getAllUsers
)
router.patch(
  '/updateUserInfo',
  protect,
  uploadUserProfilesImage,
  updateUserInfo
)
router.delete('/deleteAccount', protect, deleteUser)
router.delete(
  '/delete/:id',
  protect,
  restrictTo('system admin', 'system manager'),
  deleteUser
)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)
module.exports = router
