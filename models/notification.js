const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  message: { type: String, required: true },
  // read_by: [
  //   {
  //     readerId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       unique: true,
  //       ref: 'User',
  //     },
  //     readAt: { type: Date, default: Date.now },
  //   },
  // ],
  created_at: {
    type: Date,
    default: Date.now,
  },
})

const Notification = mongoose.model('Notification', NotificationSchema)
module.exports = Notification
