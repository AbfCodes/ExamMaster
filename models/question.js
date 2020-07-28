const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
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
  ans1: {
    type: String,
    required: [true, 'Correct Answer is required.'],
  },
  ans2: {
    type: String,
    required: [true, 'Correct Answer is required.'],
  },
  ans3: {
    type: String,
    required: [true, 'Correct Answer is required.'],
  },
  ans4: {
    type: String,
    required: [true, 'Correct Answer is required.'],
  },
})

const Question = mongoose.model('Question', QuestionSchema)

module.exports = Question
