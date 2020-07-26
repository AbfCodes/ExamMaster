const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Provide subject Name.'],
  },
  subjects: {
    type: [String],
    required: [true, 'Provide subject Name.'],
  },
})

const levelInfo = new mongoose.Schema({
  languages: {
    type: [String],
  },
  class: {
    type: [subjectSchema],
  },
})

const LevelInfo = mongoose.model('LevelInfo', levelInfo)
module.exports = LevelInfo
