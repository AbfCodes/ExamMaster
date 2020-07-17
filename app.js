const express = require('express')
const morgan = require('morgan')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
// ROUTES
// const tourRouter = require('./routes/tour')
// const userRouter = require('./routes/user')

const app = express()
app.use(express.json())
console.log(process.env.NODE_ENV)

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// 3) ROUTES
// app.use('/api/v1/tours', tourRouter)
// app.use('/api/v1/users', userRouter)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
