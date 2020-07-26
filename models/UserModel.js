const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const redeemGiftSchema = require('../models/redeemGift').redeemGiftSchema

const scoreSchema = new mongoose.Schema({
  levels: {
    type: String,
    lower: true,
  },
  language: { type: String, lower: true },
  class: { type: String, lower: true },
  subject: { type: String, lower: true },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  correctAnswers: { type: Number, default: 0 },
  incorrectAnswers: { type: Number, default: 0 },
  unattemptedQestions: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  stars: {
    type: Number,
    default: 0,
  },
})

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please tell us your name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password
      },
      message: 'Passwords are not the same!',
    },
  },
  role: {
    type: String,
    enum: ['system admin', 'system manager', 'content manager', 'user'],
    default: 'user',
  },
  // score:[{level: level 1, score: 10, stars: 3},{level: level 1, score: 10, stars: 3},...]
  scores: {
    // index: true,
    type: [scoreSchema],
  },
  badges: {
    type: [String],
    enum: ['Bronze', 'Silver', 'Gold'],
  },
  redeemGifts: {
    type: [redeemGiftSchema],
  },
  points: {
    type: Number,
    default: 10,
    min: 0,
  },
  premium: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
})

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next()

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // Delete passwordConfirm field
  this.passwordConfirm = undefined
  next()
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000
  next()
})

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } })
  next()
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    // SessionTime = 10:00(expire) < passwordChange(new) = 11:00 ==>passwordChanged(true) || notChanged(false)
    return JWTTimestamp < changedTimestamp
  }

  // False means NOT changed
  return false
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  console.log({ resetToken }, this.passwordResetToken)

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User

/*    
             ********************
    **********reference from doc**************
             ********************

var childSchema = new Schema({ name: 'string' });

var parentSchema = new Schema({
  // Array of subdocuments
  children: [childSchema],
  // Single nested subdocuments. Caveat: single nested subdocs only work
  // in mongoose >= 4.2.0
  child: childSchema
});
*/
