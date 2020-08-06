const multer = require('multer')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Question = require('../models/question')

// Multer file Uploading config
var multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/questions')
  },
  filename: function (req, file, cb) {
    //   user-id-time.jpeg
    const ext = file.mimetype.split('/')[1]
    cb(null, `Question-${req.user.id}-${Date.now()}.${ext}`)
  },
})

// Multer images Filtering
const multerFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    cb(null, true)
  else cb(new AppError('Not an image! Please upload only images.', 400), false)
}

// Multer upload setting apply
const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: multerFilter,
})

exports.uploadQuestionImage = upload.single('QuestionImage')
exports.updateQuestionImage = upload.single('updateQuestionImage')

exports.createQuestion = catchAsync(async (req, res, next) => {
  let obj = {
    mode: req.body.mode,
    subject: req.body.subject,
    language: req.body.language,
    class: req.body.class,
    correctAnswer: req.body.correctAnswer,
    ans1: req.body.ans1,
    ans2: req.body.ans2,
    ans3: req.body.ans3,
    ans4: req.body.ans4,
  }

  if (req.file && req.file.filename) obj.question = req.file.filename
  else obj.question = req.body.question
  let qes = new Question(obj)
  qes = await qes.save()

  res.status(200).json({
    status: 'success',
    data: { qes },
  })
})
exports.updateQuestion = catchAsync(async (req, res, next) => {
  const { Qid } = req.params
  let obj = {}
  if (req.body && req.body.subject) obj.subject = req.body.subject
  if (req.body && req.body.mode) obj.subject = req.body.mode
  if (req.body && req.body.language) obj.language = req.body.language
  if (req.body && req.body.class) obj.class = req.body.class
  if (req.body && req.body.correctAnswer)
    obj.correctAnswer = req.body.correctAnswer
  if (req.body && req.body.ans1) obj.ans1 = req.body.ans1
  if (req.body && req.body.ans2) obj.ans2 = req.body.ans2
  if (req.body && req.body.ans3) obj.ans3 = req.body.ans3
  if (req.body && req.body.ans4) obj.ans4 = req.body.ans4
  // image and text identification
  if (req.file && req.file.filename) obj.question = req.file.filename
  else obj.question = req.body.question
  let updateQues = await Question.findByIdAndUpdate(Qid, obj, { new: true })

  res.status(200).json({
    status: 'success',
    data: { updateQues },
  })
})

exports.allQuestionsWithMode = catchAsync(async (req, res, next) => {
  const { mode } = req.params
  const questions = await Question.find({ mode })
  res.status(200).json({
    status: 'success',
    data: { questions },
  })
})
exports.deleteQuestion = catchAsync(async (req, res, next) => {
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
