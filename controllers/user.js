const multer = require('multer')
const User = require('../models/UserModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

// Multer file Uploading config
var multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/userProfiles')
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
exports.uploadUserProfilesImage = upload.single('userProfilesImage')

let scoreIndex = undefined
let index = undefined

const findScore = (score, req) => {
  const { language, userClass, subject, level } = req.params
  return score.filter((el, i) => {
    if (
      el.language === language &&
      el.class === userClass &&
      el.subject === subject &&
      el.levels === level
    ) {
      index = i
      scoreIndex = el._id
      return el
    }
  })
}

//  Provides All '/:language/:userClass/:subject/' ==> all levels
const findManyScore = (score, req) => {
  const { language, userClass, subject, level } = req.params
  return score.filter((el) => {
    if (
      el.language === language &&
      el.class === userClass &&
      el.subject === subject
    ) {
      return el
    }
  })
}
exports.insertScores = catchAsync(async (req, res, next) => {
  const { user } = req
  user.scores.push(req.body)
  // const UPDATEUSER = user.scores.
  // const updatedUser = await User.update(
  //   { _id: user._id },
  //   { $push: { scores: req.body } }
  // )
  await user.save({ validateBeforeSave: false })

  res.status(200).json({
    status: 'success',
    data: { Scores: user.scores[user.scores.length - 1] },
  })
})

exports.updateLevelScores = catchAsync(async (req, res, next) => {
  // ROUTE: '/updateLevelScores/:language/:userClass/:subject/:level'
  const { user } = req
  const el = findScore(user.scores, req)[0]
  // console.log(el)
  // console.log(req.body.is)

  const updatedLevel = await User.findOneAndUpdate(
    { _id: user._id, 'scores._id': el._id },
    {
      $set: {
        'scores.$.isCompleted': req.body.isCompleted,
        'scores.$.correctAnswers': req.body.correctAnswers,
        'scores.$.unattemptedQestions': req.body.unattemptedQestions,
        'scores.$.score': req.body.score,
        'scores.$.stars': req.body.stars,
      },
    },
    { new: true }
  )

  res.status(200).json({
    status: 'success',
    data: { updatedLevel: updatedLevel.scores[index] },
  })
})

exports.updateUserInfo = catchAsync(async (req, res, next) => {
  const { user } = req
  const queryObj = { ...req.body }
  const excludeFields = ['scores']
  excludeFields.forEach((el) => delete queryObj[el])
  if (req.file && req.file.filename) queryObj.photo = req.file.filename

  const updatedUser = await User.findByIdAndUpdate(user._id, queryObj, {
    new: true,
  }).select(
    '-scores -passwordResetExpires -passwordResetToken -__v -passwordChangedAt '
  )

  res.status(200).json({
    status: 'success',
    data: { updatedUser },
  })
})
exports.updateRole = catchAsync(async (req, res, next) => {
  const { roleId } = req.params

  const updatedUser = await User.findByIdAndUpdate(
    roleId,
    { role: req.body.role },
    {
      new: true,
    }
  ).select(
    '-scores -passwordResetExpires -passwordResetToken -__v -passwordChangedAt '
  )

  res.status(200).json({
    status: 'success',
    data: { updatedUser },
  })
})

exports.userData = catchAsync(async (req, res, next) => {
  const { user } = req

  const userData = await User.findById(user._id).select(
    '-scores -passwordResetExpires -passwordResetToken -__v -passwordChangedAt'
  )

  res.status(200).json({
    status: 'success',
    data: { userData },
  })
})

exports.userScores = catchAsync(async (req, res, next) => {
  const { user } = req

  const userScores = await User.findById(user._id).select('scores')
  //  -passwordResetExpires -passwordResetToken -__v
  const temp = findManyScore(userScores.scores, req)
  // console.log(scoreIndex)
  let totalSc = 0
  temp.forEach((obj) => {
    if (obj['score']) totalSc += obj['score']
  })

  res.status(200).json({
    status: 'success',
    data: {
      userScores: temp,
    },
    totalScore: totalSc,
  })
})

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // Finding All Users
  const allUsers = await User.find({}).select(
    'role points premium _id userName email'
  )

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers: allUsers.length,
      allUsersList: allUsers,
    },
  })
})

exports.userScore = catchAsync(async (req, res, next) => {
  const { user } = req

  const userScore = await User.findById(user._id).select('scores')

  const temp = findScore(userScore.scores, req)
  let totalSc = 0
  temp.forEach((obj) => {
    if (obj['score']) totalSc += obj['score']
  })

  res.status(200).json({
    status: 'success',
    data: { userScore: temp },
    totalScore: totalSc,
  })
})

exports.deleteUser = catchAsync(async (req, res, next) => {
  // console.log(req.user._id)
  await User.findByIdAndDelete(req.user._id)
  res.status(204).json({
    status: 'success',
  })
})

exports.deleteUserbyId = catchAsync(async (req, res, next) => {
  // console.log(req.user._id)
  const { userId } = req.params
  await User.findByIdAndDelete(userId)
  res.status(204).json({
    status: 'success',
  })
})
