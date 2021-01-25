process.env.NODE_ENV = 'test'

const chai = require('chai')

const { expect } = chai
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const server = require('../../app')

const { Category } = require('../../models/category')

chai.use(chaiHttp)
require('dotenv').config()

describe('Routes', () => {
  /**
   * /GET REQUESTS
   */
  describe('/GET categories', () => {
    it('should GET all the categories', (done) => {
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .get('/categories')
        .end((err, res) => {
          console.log(res)
          expect(res).to.have.property('statusCode', 200)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.be.eql(4)
          done()
        })
    })
  })

  describe('/GET/:id categories', () => {
    it('it should GET a category given the id', (done) => {
      let category = new Category({
        name: 'test',
        icon: 'test-icon',
        color: '#fffff',
      })
      category.save(function(err, category) {
        if (err) return console.log(err)
      })
    chai
      .request(`${process.env.BASE_URL}${process.env.API_URL}`)
      .get(`/categories/${category._id}`)
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        expect(res).to.have.property('statusCode', 200)
        expect(res.body).to.have.property('_id').eql(`${category._id}`)
        done()
      })
      afterEach(async() => {
        await Category.deleteOne({ name: 'test' })
      })
    })
  })

  // /**
  //  * /POST REQUESTS
  //  */
  describe('/POST categories', () => {
    let token

    before((done) => {
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .post('/users/login')
        .send({
          email: 'test@test.com',
          password: '123456',
        })
        .end((err, res) => {
          if (err) {
            throw err
          }
          token = res.body.token
          done()
        })
    })
    it('should POST a category', (done) => {
      const mockCategory = {
        name: 'Test',
        icon: 'test-icon',
        color: '#242422',
      }
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .post('/categories')
        .set({ Authorization: `Bearer ${token}` })
        .send(mockCategory)
        .end((err, res) => {
          expect(res).to.have.property('statusCode', 200)
          expect(res.body).to.be.an('object')
          done()
        })
        afterEach(async() => {
          await Category.deleteMany({ name: 'Test' })
        })
    })
  })
  /**
   * DELETE REQUESTS
   */
  describe('/DELETE categories/:id', () => {
    let token
    before(done => {
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .post('/users/login')
        .send({
          email: 'test@test.com',
          password: '123456',
        })
        .end((err, res) => {
          if (err) {
            throw err
          }
          token = res.body.token
          done()
        })
    })
    let category = new Category({
      name: 'test',
      icon: 'test-icon',
      color: '#fffff',
    })
    category.save(function(err, category) {
      if (err) return console.log(err)
      console.log(category)
    })
    it('should delete a category', (done) => {
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .delete(`/categories/${category._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          console.log(res.body)
          expect(res).to.have.property('statusCode', 200)
          expect(res.body).to.be.an('object')
          done()
        })
    })
  })
  // after(function(done) {
  //   Category.deleteMany({})
  //     .then(() => {
  //       return mongoose.disconnect()
  //     })
  //     .then(() => {
  //       done()
  //     })
  // })
})

