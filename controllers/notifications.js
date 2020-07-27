const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Notification = require('../models/notification')

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
})

// exports.seenNotification = catchAsync(async (req, res, next) => {
//   const {
//     user,
//     params: { notification_id },
//   } = req
//   const seen = await Notification.findOneAndUpdate(
//     {
//       _id: notification_id,
//     },
//     { $push: { read_by: { readerId: user._id } } }
//   ).select('-__v -readerId')

//   res.status(200).json({
//     status: 'success',
//     data: { seen },
//   })
// })

exports.createNotification = catchAsync(async (req, res, next) => {
  const { user } = req
  const createdNotification = new Notification({
    sender: user._id,
    message: req.body.message,
  })
  await createdNotification.save()
  res.status(200).json({
    status: 'success',
    data: { createdNotification },
  })
})
