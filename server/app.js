const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
const mongoose = require("mongoose")

const jwtAuth = require("./helpers/jwt")
const errorHandler = require("./helpers/error-handler")
const Product = require("./models/product")
require("dotenv/config")

app.use(cors())
app.options("*", cors)

// Middleware
app.use(bodyParser.json())
app.use(morgan("tiny"))
app.use(jwtAuth())
app.use(errorHandler)

// Routes
const productsRoute = require("./routes/products")
const categoriesRoute = require("./routes/categories")
const userRoutes = require("./routes/users")
const ordersRoutes = require("./routes/orders")

const api = process.env.API_URL

app.use(`${api}/products`, productsRoute)
app.use(`${api}/categories`, categoriesRoute)
app.use(`${api}/users`, userRoutes)
app.use(`${api}/orders`, ordersRoutes)

// Database
if (process.env.NODE_ENV === "test") {
  const { MongoMemoryServer } = require('mongodb-memory-server')
  const mongoServer = new MongoMemoryServer();

  mongoose.Promise = Promise;
  mongoServer.getUri().then((mongoUri) => {
  const mongooseOpts = {
    // options for mongoose 4.11.3 and above
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  mongoose.connect(mongoUri, mongooseOpts);

  mongoose.connection.on('error', (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e);
      mongoose.connect(mongoUri, mongooseOpts);
    }
    console.log(e);
  });

  mongoose.connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
});
} else {
  mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then((res) => {
      console.log("Successfully connected to Database")
    })
    .catch((err) => {
      console.log(err)
    })
}

app.listen(3000, () => {
  console.log("Server connected")
})

module.exports = app