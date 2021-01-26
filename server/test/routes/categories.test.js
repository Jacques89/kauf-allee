process.env.NODE_ENV = 'test'

const chai = require('chai')

const { expect } = chai
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const server = require('../../app')
const { userAuth } = require('../helpers/test-handlers')

const { Category } = require('../../models/category')

chai.use(chaiHttp)
require('dotenv').config()

describe('Category Routes', () => {
  // Empty the database
  after(done => {
    Category.deleteMany({}, err => {
      done()
    })
  })
  /**
   * /GET REQUESTS
   */
  describe('/GET categories', () => {
    it('should GET all the categories', (done) => {
      // Empty the database before fetching the categories
      before(done => {
        Category.deleteMany({}, err => {
          done()
        })
      })
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .get('/categories')
        .end((err, res) => {
          expect(res).to.have.property('statusCode', 200)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.be.eql(1)
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
      category.save((err, category) => {
        if (err) throw err
      })
    chai
      .request(`${process.env.BASE_URL}${process.env.API_URL}`)
      .get(`/categories/${category._id}`)
      .end((err, res) => {
        console.log(category)
        expect(res.body).to.be.an('object')
        expect(res).to.have.property('statusCode', 200)
        expect(res.body).to.have.property('_id').eql(`${category._id}`)
        done()
      })
    })
  })

  /**
   * /POST REQUESTS
   */
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
          if (err) throw err
          token = res.body.token
          done()
        })
    })
    it('should POST a category', (done) => {
      const category = {
        name: 'Test',
        icon: 'test-icon',
        color: '#242422',
      }
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .post('/categories')
        .set({ Authorization: `Bearer ${token}` })
        .send(category)
        .end((err, res) => {
          expect(res).to.have.property('statusCode', 200)
          expect(res.body).to.be.an('object')
          done()
        })
    })
  })
  /**
   * DELETE REQUESTS
   */
  describe('/DELETE categories/:id', () => {
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
          if (err) throw err
          token = res.body.token
          done()
        })
    })
    let category = new Category({
      name: 'delete-test',
      icon: 'test-icon',
      color: '#fffff',
    })
    category.save((err, category) => {
      if (err) throw err
    })
    it('should DELETE a category given the id', (done) => {
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .delete(`/categories/${category._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.property('statusCode', 200)
          expect(res.body).to.have.property('message').eql('Category deleted successfully!')
          expect(res.body).to.have.property('success').eql(true)
          expect(res.body).to.be.an('object')
          done()
        })
    })
  })
})

