const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Notification = require('../models/notification')

exports.getAllInfo = catchAsync(async (req, res, next) => {
  const allLevelRecords = await LevelInfo.find({}).select('-__v')
  res.status(200).json({
    status: 'success',
    data: { allLevelRecords },
  })
})
