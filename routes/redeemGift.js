const path = require('path')
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
router.post(
  '/create',
  protect,
  restrictTo('system admin'),
  uploadRedeemGiftImage,
  createRedeemGift
)
router.get('/awardRedeemGift/:name', protect, awardRedeemGift)
router.patch(
  '/update/:id',
  protect,
  restrictTo('system admin'),
  updateRedeemGiftImage,
  updateRedeemGift
)
router.delete(
  '/delete/:id',
  protect,
  restrictTo('system admin'),
  deleteRedeemGift
)

module.exports = router
