const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

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
mongoose
.connect(process.env.DATABASE, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}
)
.then(res => {
  console.log('Successfully connected to Database')
})
.catch(err => {
  console.log(err)
})

app.listen(3000, () => {
  console.log('Server connected')
})