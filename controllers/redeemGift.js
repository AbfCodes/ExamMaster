const User = require('../models/UserModel')
const RedeemGift = require('../models/redeemGift').RedeemGift
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.createRedeemGift = catchAsync(async (req, res, next) => {
  // receive = {name,photo,information,costPoints}
  const addGift = await RedeemGift.create(req.body)
  res.status(201).json({
    status: 'success',
    data: { gift: addGift },
  })
})

exports.getAllRedeemGifts = catchAsync(async (req, res, next) => {
  // receive = {name,photo,information,costPoints}
  const allRedeemGifts = await RedeemGift.find({})
  res.status(200).json({
    status: 'success',
    data: { allRedeemGifts },
  })
})

exports.updateRedeemGift = catchAsync(async (req, res, next) => {
  // receive = {name,photo,information,costPoints}
  const updatedGift = await RedeemGift.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.status(200).json({
    status: 'success',
    data: { updatedGift },
  })
})

exports.deleteRedeemGift = catchAsync(async (req, res, next) => {
  // receive = {name,photo,information,costPoints}
  await RedeemGift.findByIdAndDelete(req.params.id)
  res.status(200).json({
    status: 'success',
  })
})

exports.awardRedeemGift = catchAsync(async (req, res, next) => {
  const { user } = req
  const awardingRedeemGift = await RedeemGift.findOne({
    name: req.params.name,
  }).select('-__v')

  user.redeemGifts.push(awardingRedeemGift)
  await user.save({ validateBeforeSave: false })
  res.status(200).json({
    status: 'success',
    data: { redeemGifts: user.redeemGifts },
  })
})
