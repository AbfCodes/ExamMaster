const express = require('express')

const {
  createRedeemGift,
  awardRedeemGift,
  updateRedeemGift,
  deleteRedeemGift,
  updateRedeemGiftImage,
  uploadRedeemGiftImage,
  getAllRedeemGifts,
} = require('../controllers/redeemGift')
const { protect, restrictTo } = require('../controllers/auth')

const router = express.Router()
router.get(
  '/getAllRedeemGifts',
  protect,
  restrictTo('system admin'),
  getAllRedeemGifts
)
module.exports = router
