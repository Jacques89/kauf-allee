process.env.NODE_ENV = 'test'

const chai = require('chai')

const { expect } = chai
const chaiHttp = require('chai-http')
const { afterEach } = require('mocha')
const mongoose = require('mongoose')
const server = require('../../app')

const { Product } = require('../../models/product')
const { Category } = require('../../models/category')

chai.use(chaiHttp)
require('dotenv').config()

describe('Product Routes', () => {
  after(done => {
    Category.deleteMany({}, err => {
      done()
    })
  })
  after(done => {
    Product.deleteMany({}, err => {
      done()
    })
  })
  /**
   * /GET REQUESTS
   */
  describe('/GET products', () => {
    it('should GET all the products', (done) => {
      before(done => {
        Product.deleteMany({}, err => {
          done()
        })
      })
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .get('/products')
        .end((err, res) => {
          expect(res).to.have.property('statusCode', 200)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.be.eql(0)
          done()
        })
    })
  })

  describe('/GET/:id products', () => {
    it('it should GET a product given the id', (done) => {
      before(done => {
        Product.deleteMany({}, err => {
          done()
        })
      })
      let category = new Category({
        name: 'test',
        icon: 'test-icon',
        color: '#fffff',
      })
      let product = new Product({
        name: 'test',
        description: 'test',
        mainDescription: 'test',
        image: '',
        brand: 'test',
        price: 23,
        category: `${category._id}`,
        stockCount: 25,
        rating: 5,
        numReviews: 4,
        isFeatured: true
      })
      product.save((err, product) => {
        if (err) throw err
      })
    chai
      .request(`${process.env.BASE_URL}${process.env.API_URL}`)
      .get(`/products/${product._id}`)
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        expect(res).to.have.property('statusCode', 200)
        expect(res.body).to.have.property('id').eql(`${product._id}`)
        done()
      })
    })
  })

  /**
   * /POST REQUESTS
   */
  describe('/POST products', () => {
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
    it('should POST a product', (done) => {
      let category = new Category({
        name: 'test',
        icon: 'test-icon',
        color: '#fffff',
      })
      category.save((err, category) => {
        if (err) throw err
        console.log(category)
      })
      const product = {
        name: 'test',
        description: 'test',
        mainDescription: 'test',
        image: '',
        brand: 'test',
        price: 23,
        category: `${category._id}`,
        stockCount: 25,
        rating: 5,
        numReviews: 4,
        isFeatured: true
      }
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .post('/products')
        .set({ Authorization: `Bearer ${token}` })
        .send(product)
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
  // describe('/DELETE products/:id', () => {
  //   let token

  //   before(done => {
  //     chai
  //       .request(`${process.env.BASE_URL}${process.env.API_URL}`)
  //       .post('/users/login')
  //       .send({
  //         email: 'test@test.com',
  //         password: '123456',
  //       })
  //       .end((err, res) => {
  //         if (err) throw err
  //         token = res.body.token
  //         done()
  //       })
  //   })
  //   let category = new Category({
  //     name: 'test',
  //     icon: 'test-icon',
  //     color: '#fffff',
  //   })
  //   category.save((err, category) => {
  //     if (err) throw err
  //   })
  //   let product = new Product({
  //     name: 'test',
  //     description: 'test',
  //     mainDescription: 'test',
  //     image: '',
  //     brand: 'test',
  //     price: 23,
  //     category: '600f17789d422b3337131bd0',
  //     stockCount: 25,
  //     rating: 5,
  //     numReviews: 4,
  //     isFeatured: true
  //   })
  //   product.save((err, product) => {
  //     if (err) throw err
  //   })
  //   it('should DELETE a product', (done) => {
  //     chai
  //       .request(`${process.env.BASE_URL}${process.env.API_URL}`)
  //       .delete(`/product/${product.id}`)
  //       .set({ Authorization: `Bearer ${token}` })
  //       .end((err, res) => {
  //         expect(res).to.have.property('statusCode', 200)
  //         expect(res.body).to.have.property('message', 'Category deleted successfully!')
  //         expect(res.body).to.be.an('object')
  //         done()
  //       })
  //   })
  //   after(done => {
  //     Category.deleteMany({}, err => {
  //       done()
  //     })
  //   })
  // })
})


