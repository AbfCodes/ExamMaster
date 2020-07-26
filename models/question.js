const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required.'],
  },
  language: { type: String, required: [true, 'language is required.'] },
  class: { type: String, required: [true, 'class is required.'] },
  question: {
    type: String,
    unique: true,
    required: [true, 'Question is required.'],
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct Answer is required.'],
  },
  options: {
    type: [String],
  },
})
