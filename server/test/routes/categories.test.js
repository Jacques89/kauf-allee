const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { Category } = require('../../models/category')

// const  getCategories  = require('../../controllers/categories')
// const { Category } = require('../../models/category')

chai.use(chaiHttp)
require('dotenv').config()

// let mongoServer

// before(async () => {
//   mongoServer = new MongoMemoryServer()
//   const mongoUri = await mongoServer.getUri()
//   await mongoose.connect(mongoUri)
//   await Category.remove({})
// })

// after(async () => {
//   await Category.remove({})
//   await mongoose.disconnect()
//   await mongoServer.stop()
// })

// // describe('...', () => {
// //   it('...', async () => {
// //     const Category = mongoose.model('Category', new mongoose.Schema({ name: String }))
// //     const cnt = await Category.count()
// //     expect(cnt).to.equal(0)
// //   })
// // })

describe('Routes', function() {
  describe('/GET categories', () => {
    it('should GET all the categories', (done) => {
      chai.request(`${process.env.BASE_URL}${process.env.API_URL}`)
      .get('/categories')
      .end((err, res) => {
        expect(res).to.have.property('statusCode', 200)
        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.eql(4)
        done()
      })
    })
  })

  describe('/GET categories/:id', () => {
    it('should GET a category ID', (done) => {
      chai.request(`${process.env.BASE_URL}${process.env.API_URL}`)
      .get('/categories/5ff3326caaeee4111ec81ea0')
      .end((err, res) => {
        expect(res).to.have.property('statusCode', 200)
        expect(res.body).to.be.an('object')
        expect(res.body.length).to.be.eql(1)
        done()
      })
    })
  })
})
