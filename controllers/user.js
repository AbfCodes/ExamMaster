const User = require('../models/UserModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

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

  const updatedLevel = await User.findOneAndUpdate(
    { 'scores._id': el._id },
    {req.body}
  )

  res.status(200).json({
    status: 'success',
    data: { updatedLevel },
  })
})

exports.updateUserInfo = catchAsync(async (req, res, next) => {
  const { user } = req
  console.log(req.body)
  const queryObj = { ...req.body }
  const excludeFields = ['scores']
  excludeFields.forEach((el) => delete queryObj[el])
  const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
    new: true,
  }).select('-scores')

  res.status(200).json({
    status: 'success',
    data: { updatedUser },
  })
})

exports.userData = catchAsync(async (req, res, next) => {
  const { user } = req

  const userData = await User.findById(user._id).select('-scores')

  res.status(200).json({
    status: 'success',
    data: { userData },
  })
})

exports.userScores = catchAsync(async (req, res, next) => {
  const { user } = req

  const userScores = await User.findById(user._id).select('scores')

  const temp = findManyScore(userScores.scores, req)
  console.log(scoreIndex)
  let totalSc = 0
  temp.forEach((obj) => {
    if (obj['score']) totalSc += obj['score']
  })

  res.status(200).json({
    status: 'success',
    data: { userScores: temp },
    totalScore: totalSc,
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
  console.log(req.user._id)
  await User.findByIdAndDelete(req.user._id)
  res.status(204).json({
    status: 'success',
  })
})
