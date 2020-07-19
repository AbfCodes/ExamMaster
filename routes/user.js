const express = require('express')
const { signup, login } = require('../controllers/auth')
const { userData, updateScores } = require('../controllers/user')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

// router.route('/:id').get(userData).patch(updateScores)
// router.post('/users', createUser)

module.exports = router
