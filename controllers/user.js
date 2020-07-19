const User = require('../models/UserModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

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
  const nestedDocID = user.scores.filter((el) => {
    if (level && language)
      return el.levels === level && el.language === language
    else return el.levels === level
  })
  // console.log(nestedDocID)
  // const updatedUser = await User.update(
  //   { _id: user._id },
  //   { $set: { scores: req.body } }
  // )

  res.status(200).json({
    status: 'success',

    data: { nestedDocID },
  })
})

exports.updateUserInfo = catchAsync(async (req, res, next) => {
  const { user } = req
  const updatedUser = await User.findByIdAndUpdate(user._id, req.body)
  res.status(200).json({
    status: 'success',
    data: { updatedUser },
  })
})

exports.userData = catchAsync(async (req, res, next) => {
  const { user } = req
  const userScores = await User.findById(user._id)
  let totalSc = 0
  userScores.scores.forEach((obj) => {
    if (obj['score']) totalSc += obj['score']
  })
  res.status(200).json({
    status: 'success',
    data: { userScores },
    totalScore: totalSc,
  })
})
/*
  let totalSc=0
scores.forEach(obj=>{
    if(obj['score']) totalSc+=obj['score']    
})
console.log(totalSc)
*/
