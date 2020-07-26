const mongoose = require('mongoose')

const redeemGiftSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Gift Must have a Name.'],
  },
  photo: {
    type: String,
    // required: [true, 'Gift Must have a Photo.'],
  },
  information: {
    type: String,
    maxlength: 100,
    required: [true, 'Provide Gift information.'],
  },
  costPoints: {
    type: Number,
    default: 40,
  },
})

const RedeemGift = mongoose.model('RedeemGift', redeemGiftSchema)
module.exports = { RedeemGift, redeemGiftSchema }
