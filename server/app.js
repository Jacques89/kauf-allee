const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const jwtAuth = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')
const Product = require('./models/product')
require('dotenv/config')

app.use(cors())
app.options('*', cors)

// Middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(jwtAuth())
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(errorHandler)

// Routes
const productsRoute = require('./routes/products')
const categoriesRoute = require('./routes/categories')
const userRoutes = require('./routes/users')
const ordersRoutes = require('./routes/orders')

const api = process.env.API_URL

app.use(`${api}/products`, productsRoute)
app.use(`${api}/categories`, categoriesRoute)
app.use(`${api}/users`, userRoutes)
app.use(`${api}/orders`, ordersRoutes)

// Database
if (process.env.NODE_ENV === 'test') {
  const mongoUriTest = process.env.TEST_DATABASE
  mongoose
    .connect(mongoUriTest, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then((res) => {
      console.log('Successfully connected to Test_Database')
    })
    .catch((err) => {
      console.log(err)
    })
} else {
  const mongoUri = process.env.DATABASE
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then((res) => {
      console.log('Successfully connected to Database')
    })
    .catch((err) => {
      console.log(err)
    })
}

app.listen(3000, () => {
  console.log('Server connected')
})

module.exports = app
