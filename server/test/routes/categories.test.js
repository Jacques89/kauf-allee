const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { Category } = require('../../models/category')
const { User } = require('../../models/user')

// const  getCategories  = require('../../controllers/categories')
// const { Category } = require('../../models/category')

chai.use(chaiHttp)
require('dotenv').config()

describe('Routes', () => {
  /**
  * /GET REQUESTS
  */
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
        expect(res.body).to.have.property('_id', '5ff3326caaeee4111ec81ea0')
        expect(res.body).to.be.an('object')      
        done()
      })
    })
  })

  /**
   * /POST REQUESTS
   */
  describe('/POST categories', () => {
    let token
    before(done => {
      chai.request(`${process.env.BASE_URL}${process.env.API_URL}`)
      .post('/users/login')
      .send({
        email: 'james@test.com',
        password: '123456',
      })
      .end((err, res) => {
        if (err) {
          throw err
        }
        token = res.body.token 
        console.log(res.body.token)
        done()
      })
      // user = new User({
      //   name: 'Test',
      //   email: 'test@test.com',
      //   password: 'testytest',
      //   isAdmin: true,
      //   street: 'teststr 88',
      //   postcode: 'testtest',
      //   city: 'test',
      //   country: 'testland'
      // })
      // user.save()
    })
    it('should POST a category', (done) => {
      const category = {
        name: "Test",
        icon: "test-icon",
        color: "#242422"
      }
      chai.request(`${process.env.BASE_URL}${process.env.API_URL}`)
      .post('/categories')
      .set({ Authorization: `Bearer ${token}` })
      .send(category)
      .end((err, res) => {
        expect(res).to.have.property('statusCode', 200)
        expect(res.body).to.be.an('object')
        done()
      })
    })

    afterEach(() => {
      User.remove({}, () => {})
      Category.remove({}, () => {})
    })
  })
})