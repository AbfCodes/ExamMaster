const mongoose = require('mongoose')

const levelInfo = new mongoose.Schema({
  language: {
    type: String,
    required: [true, 'Provide language Name.'],
    trim: true,
  },
  class: {
    type: String,
    required: [true, 'Provide class Name.'],
    trim: true,
  },
  subjects: {
    type: [String],
    required: [true, 'Provide subject Names.'],
  },
})

const LevelInfo = mongoose.model('LevelInfo', levelInfo)
module.exports = LevelInfo

// const subjectSchema = new mongoose.Schema({
//   class: {
//     type: String,
//     required: [true, 'Provide subject Name.'],
//   },
//   subjects: {
//     type: [String],
//     required: [true, 'Provide subject Name.'],
//   },
// })
