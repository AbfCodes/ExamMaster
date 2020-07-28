const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.log(err.name, err.message, err)
  process.exit(1)
})

dotenv.config({ path: './config.env' })
const app = require('./app')
const { PORT, DATABASE, DATABASE_PASSWORD } = process.env
const DB = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD)
// DATABASE CONNECTION
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Database Connected!'))

const port = PORT || 3000
const server = app.listen(port, '192.168.0.104', () => {
  console.log(`App running on port ${port}...`)
})

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
