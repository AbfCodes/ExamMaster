const multer = require('multer')
const RedeemGift = require('../models/redeemGift').RedeemGift
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
// Multer file Uploading config
var multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images')
  },
  filename: function (req, file, cb) {
    //   user-id-time.jpeg
    const ext = file.mimetype.split('/')[1]
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
  },
})

// Multer images Filtering
const multerFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    cb(null, true)
  else cb(new AppError('Not an image! Please upload only images.', 400), false)
}

// Multer upload setting apply
const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: multerFilter,
})
exports.uploadRedeemGiftImage = upload.single('redeemGiftImage')
exports.updateRedeemGiftImage = upload.single('updateRedeemGiftImage')

exports.createRedeemGift = catchAsync(async (req, res, next) => {
  // console.log(req.file)
  // receive = {name,photo,information,costPoints}
  const redeemGift = new RedeemGift({
    name: req.body.name,
    photo: req.file.filename,
    information: req.body.information,
    costPoints: req.body.costPoints,
  })
  const addGift = await redeemGift.save()

  res.status(201).json({
    status: 'success',
    data: {
      gift: addGift,
    },
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
  const updatedReddemgift = { ...req.body }
  // console.log(req.file.filename)
  if (req.file && req.file.filename) updatedReddemgift.photo = req.file.filename
  // console.log(updatedReddemgift)
  // console.log('file name : ', req.file.filename)
  const updatedGift = await RedeemGift.findByIdAndUpdate(
    req.params.id,
    updatedReddemgift,
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
