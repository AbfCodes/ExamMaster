const express = require('express')
const {
  allNotifications,
  createNotification,
  seenNotification,
} = require('../controllers/notifications')
const { protect, restrictTo } = require('../controllers/auth')

const router = express.Router()
router.get('/receiveAll', protect, allNotifications)
// router.get('/seenNotification/:notification_id', protect, seenNotification)
router.post('/create', protect, restrictTo('system admin'), createNotification)

module.exports = router
