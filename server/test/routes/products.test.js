process.env.NODE_ENV = 'test'

const chai = require('chai')

const { expect } = chai
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const server = require('../../app')

const { Product } = require('../../models/product')

chai.use(chaiHttp)
require('dotenv').config()

describe('Product Routes', () => {
  /**
   * /GET REQUESTS
   */
  describe('/GET products', () => {
    it('should GET all the products', (done) => {
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .get('/products')
        .end((err, res) => {
          expect(res).to.have.property('statusCode', 200)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.be.eql(1)
          done()
        })
    })
  })

  describe('/GET/:id products', () => {
    it('it should GET a product given the id', (done) => {
      let product = new Product({
        name: 'test',
        description: 'test',
        mainDescription: 'test',
        image: '',
        brand: 'test',
        price: 23,
        category: '600f17789d422b3337131bd0',
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
        console.log(res)
        expect(res.body).to.be.an('object')
        expect(res).to.have.property('statusCode', 200)
        expect(res.body).to.have.property('id').eql(`${product.id}`)
        done()
      })
      after(async() => {
        await Product.deleteOne({ name: 'test' })
      })
    })
  })

  /**
   * /POST REQUESTS
   */
  // describe('/POST categories', () => {
  //   let token

  //   before((done) => {
  //     chai
  //       .request(`${process.env.BASE_URL}${process.env.API_URL}`)
  //       .post('/users/login')
  //       .send({
  //         email: 'test@test.com',
  //         password: '123456',
  //       })
  //       .end((err, res) => {
  //         if (err) {
  //           throw err
  //         }
  //         token = res.body.token
  //         done()
  //       })
  //   })
  //   it('should POST a category', (done) => {
  //     const category = {
  //       name: 'Test',
  //       icon: 'test-icon',
  //       color: '#242422',
  //     }
  //     chai
  //       .request(`${process.env.BASE_URL}${process.env.API_URL}`)
  //       .post('/categories')
  //       .set({ Authorization: `Bearer ${token}` })
  //       .send(category)
  //       .end((err, res) => {
  //         expect(res).to.have.property('statusCode', 200)
  //         expect(res.body).to.be.an('object')
  //         done()
  //       })
  //       after(async() => {
  //         await Category.deleteMany({ name: 'Test' })
  //       })
  //   })
  // })
  // /**
  //  * DELETE REQUESTS
  //  */
  // describe('/DELETE categories/:id', () => {
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
  //         if (err) {
  //           throw err
  //         }
  //         token = res.body.token
  //         done()
  //       })
  //   })
  //   let category = new Category({
  //     name: 'test',
  //     icon: 'test-icon',
  //     color: '#fffff',
  //   })
  //   category.save(function(err, category) {
  //     if (err) return console.log(err)
  //   })
  //   it('should DELETE a category', (done) => {
  //     chai
  //       .request(`${process.env.BASE_URL}${process.env.API_URL}`)
  //       .delete(`/categories/${category._id}`)
  //       .set({ Authorization: `Bearer ${token}` })
  //       .end((err, res) => {
  //         expect(res).to.have.property('statusCode', 200)
  //         expect(res.body).to.have.property('message', 'Category deleted successfully!')
  //         expect(res.body).to.be.an('object')
  //         done()
  //       })
  //   })
  // })
})


