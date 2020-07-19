const User = require('../models/UserModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

exports.updateScores = catchAsync((req, res, next) => {
  res.status(200).json({
    status: 'route not imlemented yet',
  })
})
exports.userData = catchAsync((req, res, next) => {
  const id = req.params.id
  res.status(200).json({
    status: 'success',
    data: {
      user: id,
    },
  })
})
/*
  let totalSc=0
scores.forEach(obj=>{
    if(obj['score']) totalSc+=obj['score']    
})
console.log(totalSc)
*/
