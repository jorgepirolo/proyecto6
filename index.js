require('dotenv').config()

const express = require('express')
const { connectDB } = require('./src/config/db')
const clientsRouter = require('./src/api/routes/client')
const citiesRouter = require('./src/api/routes/city')

const app = express()

connectDB()

app.use(express.json())

app.use('/api/v1/clients', clientsRouter)
app.use('/api/v1/cities', citiesRouter)

app.use('*', (req, res, next) => {
  return res.status(404).json('Route not found ☠️')
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
