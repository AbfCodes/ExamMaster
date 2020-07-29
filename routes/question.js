const express = require('express')

const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  uploadQuestionImage,
  updateQuestionImage,
} = require('../controllers/question')
const { protect, restrictTo } = require('../controllers/auth')

const router = express.Router()

router.post(
  '/Add',
  protect,
  restrictTo('system admin', 'content manager'),
  uploadQuestionImage,
  createQuestion
)
router.patch(
  '/update/:Qid',
  protect,
  restrictTo('system admin', 'content manager'),
  updateQuestionImage,
  updateQuestion
)

router.delete(
  '/delete',
  protect,
  restrictTo('system admin', 'content manager'),
  deleteQuestion
)

module.exports = router
