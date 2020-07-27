const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Question = require('../models/question')

exports.allNotifications = catchAsync(async (req, res, next) => {
  const { user } = req
  const allLevelRecords = await Notification.find({})
    .populate('user')
    .select('-__v')
    .sort('-created_at')

  res.status(200).json({
    status: 'success',
    data: { allLevelRecords },
  })