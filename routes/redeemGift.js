const express = require('express')

const {
  createRedeemGift,
  awardRedeemGift,
  updateRedeemGift,
  deleteRedeemGift,
  getAllRedeemGifts,
} = require('../controllers/redeemGift')
const { userData } = require('../controllers/user')
const { protect, restrictTo } = require('../controllers/auth')
const { route } = require('./user')
const { create } = require('../models/UserModel')

const router = express.Router()

router.get(
  '/getAllRedeemGifts',
  protect,
  restrictTo('system admin'),
  getAllRedeemGifts
)
router.post('/create', protect, restrictTo('system admin'), createRedeemGift)
router.get('/awardRedeemGift/:name', protect, awardRedeemGift)
router.patch(
  '/update/:id',
  protect,
  restrictTo('system admin'),
  updateRedeemGift
)
router.delete(
  '/delete/:id',
  protect,
  restrictTo('system admin'),
  deleteRedeemGift
)

module.exports = router
