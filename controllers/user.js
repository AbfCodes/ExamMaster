const User = require('../models/UserModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

let scoreIndex = undefined
const findScore = (score, req) => {
  const { language, userClass, subject, level } = req.params
  console.log(language, userClass, subject, level)
  return score.filter((el, index) => {
    if (
      el.language === language &&
      el.class === userClass &&
      el.subject === subject &&
      el.levels === level
    ) {
      scoreIndex = index
      return el
    }
    // else if (
    //   el.language === language &&
    //   el.class === userClass &&
    //   el.subject === subject
    // ) {
    //   scoreIndex = index
    //   return el
    // }
  })
}
exports.updateScores = catchAsync(async (req, res, next) => {
  const { user } = req
  const updatedUser = await User.update(
    { _id: user._id },
    { $push: { scores: req.body } }
  )

  res.status(200).json({
    status: 'success',
    data: { Scores: updatedUser.scores },
  })
})

exports.updateLevelScores = catchAsync(async (req, res, next) => {
  const { user } = req
  const { level, language } = req.params
  const nestedDoc = user.scores.filter((el) => {
    if (level && language)
      return el.levels === level && el.language === language
    else return el.levels === level
  })
  console.log(nestedDoc._id)
  // const updatedUser = await User.update(
  //   { _id: user._id },
  //   { $set: { scores: req.body } }
  // )

  res.status(200).json({
    status: 'success',

    data: { nestedDoc },
  })
})

exports.updateUserInfo = catchAsync(async (req, res, next) => {
  const { user } = req
  const { language, subject, userClass } = req.params

  const updatedUser = await User.findByIdAndUpdate(user._id, req.body)
  res.status(200).json({
    status: 'success',
    data: { updatedUser },
  })
})

exports.userData = catchAsync(async (req, res, next) => {
  const { user } = req
  const userScores = await User.findById(user._id).select('-scores')

  res.status(200).json({
    status: 'success',
    data: { userScores },
  })
})

exports.userScores = catchAsync(async (req, res, next) => {
  const { user } = req
  const { language, userClass, subject } = req.params

  const userScores = await User.findById(user._id).select('scores')

  const temp = findScore(userScores.scores, req)
  console.log(scoreIndex)
  let totalSc = 0
  temp.forEach((obj) => {
    if (obj['score']) totalSc += obj['score']
  })
  // console.log(userScores.scores)
  res.status(200).json({
    status: 'success',
    data: { userScores: temp },
    totalScore: totalSc,
  })
})
