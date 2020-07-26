const express = require('express')
const {
  getAllInfo,
  addLevelRecord,
  deleteLevelRecord,
  updateLevelRecord,
} = require('../controllers/levelInfo')
const { protect, restrictTo } = require('../controllers/auth')

const router = express.Router()

router.get(
  '/getAllInfo',
  protect,
  restrictTo('system admin', 'system manager', 'content manager'),
  getAllInfo
)
router.post(
  '/addLevelRecord',
  protect,
  restrictTo('system admin', 'system manager', 'content manager'),
  addLevelRecord
)
router.delete(
  '/deleteLevelRecord/:id',
  protect,
  restrictTo('system admin', 'system manager', 'content manager'),
  deleteLevelRecord
)
router.patch(
  '/updateLevelRecord/:id',
  protect,
  restrictTo('system admin', 'system manager', 'content manager'),
  updateLevelRecord
)

module.exports = router
