require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app = express()
const { connectToDatabase, disconnectFromDatabase } = require('./db')
const { router } = require('./api/routes')

connectToDatabase()

const start = async () => {
  try {
    app
      .use(cors())
      .use(morgan('dev'))
      .use(express.json())
    app
      .get('/', (req, res) => res.send('Welcome to EventSync API with MONGO'))
      .use('/api', router)
      .listen(process.env.EXPRESS_PORT || 2222)
    console.info(`Mongo API running on port ${process.env.EXPRESS_PORT}`)
  } catch (err) {
    throw new Error(`Cannot start mongo on port ${process.env.EXPRESS_PORT}, ${err}`)
  }
}

start()
