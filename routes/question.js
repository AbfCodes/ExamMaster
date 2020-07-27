const express = require('express')

const {} = require('../controllers/question')
const { protect, restrictTo } = require('../controllers/auth')

const router = express.Router()

module.exports = router
