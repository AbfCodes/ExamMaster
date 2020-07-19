const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
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
  // score:[{level: level 1, score: 10, stars: 3},{level: level 1, score: 10, stars: 3},...]
  scores: {
    type: [
      {
        levels: {
          type: String,
          lower: true,
          required: [true, 'level can not be empty.'],
        },
        language: { type: String, lower: true },
        isCompleted: {
          type: Boolean,
          default: false,
        },
        correctAnswers: Number,
        incorrectAnswers: Number,
        unattemptedQestions: Number,
        score: { type: Number, required: [true, 'score can not be empty.'] },
        stars: {
          type: Number,
          required: [true, 'stars can not be empty. '],
          min: [0, 'Stars must be equal or above Zero.'],
          max: [3, 'Stars must be less than and equal to 3.'],
        },
      },
    ],
  },
  points: {
    type: Number,
    min: [0, 'Points must be greater than Zero.'],
    default: 0,
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
