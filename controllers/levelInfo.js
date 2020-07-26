const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const LevelInfo = require('../models/levelInfo')

exports.getAllInfo = catchAsync(async (req, res, next) => {
  const allLevelRecords = await LevelInfo.find({}).select('-__v')
  res.status(200).json({
    status: 'success',
    data: { allLevelRecords },
  })
})

exports.addLevelRecord = catchAsync(async (req, res, next) => {
  // DATA : language:URDU , class:Eight, subjects:['Urdu','Arabic','english']

  const addLevelRecord = new LevelInfo()
  addLevelRecord.language = req.body.language
  addLevelRecord.class = req.body.class
  addLevelRecord.subjects.push(...req.body.subjects.split(','))
  const newRecord = await addLevelRecord.save()
  res.status(201).json({
    status: 'success',
    data: {
      newRecord,
    },
  })
})
exports.deleteLevelRecord = catchAsync(async (req, res, next) => {
  await LevelInfo.findByIdAndDelete(req.params.id)
  res.status(204).json({
    status: 'success',
  })
})
exports.updateLevelRecord = catchAsync(async (req, res, next) => {
  const currentLevel = await LevelInfo.findOne({ _id: req.params.id }).select(
    '-__V'
  )
  if (req.body.language) currentLevel.language = req.body.language
  if (req.body.class) currentLevel.class = req.body.class
  if (req.body.subjects)
    currentLevel.subjects = [...req.body.subjects.split(',')]
  const updatedLevel = await currentLevel.save({ validateBeforeSave: false })
  res.status(200).json({
    status: 'success',
    data: { updatedLevel },
  })
})
