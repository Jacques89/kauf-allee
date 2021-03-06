/**
 * products.tests.js 
 * @fileoverview Test routes for products
 * @author Jacques Nalletamby
 */

process.env.NODE_ENV = 'test'

const chai = require('chai')

const { expect } = chai
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const fs = require('fs')

const { Product } = require('../models/product')
const { Category } = require('../models/category')

chai.use(chaiHttp)
require('dotenv').config()

describe('Product Routes', () => {
  const server = `${process.env.BASE_URL}${process.env.API_URL}`

  let token
  // Login to enable authenticated routes
  before((done) => {
    chai
      .request(server)
      .post('/users/login')
      .send({
        email: 'testadmin@test.com',
        password: '123456',
      })
      .end((err, res) => {
        if (err) throw err
        token = res.body.token
        done()
      })
  })
  // Empty the database
  after(done => {
    Product.deleteMany({}, err => {
      done()
    })
  })
  after(done => {
    Category.deleteMany({}, err => {
      done()
    })
  })

  /**
   * /GET REQUESTS
   */
  describe('/GET products', () => {
    it('should GET all the products', (done) => {
      chai
        .request(server)
        .get('/products')
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(200)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.be.eql(0)
          done()
        })
    })
  })

  describe('/GET/:id products', () => {
    it('it should GET a product given the id', (done) => {
      let category = new Category({
        name: 'Get-category',
        icon: 'getCategory-icon',
        color: '#fffff',
      })
      let product = new Product({
        name: 'test',
        description: 'test description',
        mainDescription: 'test main description',
        image: '',
        brand: 'test',
        price: 35,
        category: `${category._id}`,
        stockCount: 25,
        rating: 5,
        numReviews: 4,
        isFeatured: false
      })
      product.save((err, product) => {
        if (err) throw err
        chai
          .request(server)
          .get(`/products/${product._id}`)
          .end((err, res) => {
            expect(res.body).to.be.an('object')
            expect(res).to.have.property('statusCode').eql(200)
            expect(res.body).to.have.property('name').eql(product.name)
            expect(res.body).to.have.property('description').eql(product.description)
            expect(res.body).to.have.property('mainDescription').eql(product.mainDescription)
            expect(res.body).to.have.property('brand').eql(product.brand)
            expect(res.body).to.have.property('price').eql(product.price)
            expect(res.body).to.have.property('stockCount').eql(product.stockCount)
            expect(res.body).to.have.property('rating').eql(product.rating)
            expect(res.body).to.have.property('numReviews').eql(product.numReviews)
            expect(res.body).to.have.property('isFeatured').eql(product.isFeatured)
            expect(res.body).to.have.property('_id').eql(`${product._id}`)
            done()
          })
      })
    })
    it('should show an error message given a false id', (done) => {
      const fakeId = '600ed7ea059fa61ba4711232'
      chai
        .request(server)
        .get(`/products/${fakeId}`)
        .end((err, res) => {
          expect(res.body).to.be.an('object')
          expect(res).to.have.property('statusCode').eql(500)
          expect(res.body).to.have.property('message').eql('Product ID was not found')
          done()
        })
    })
  })

  /**
   * /POST REQUESTS
   */
  describe('/POST products', () => {
    it('should CREATE a product with a single image upload', (done) => {
      let category = new Category({
        name: 'category',
        icon: 'category-icon',
        color: '#fffff',
      })
      category.save((err, category) => {
        if (err) throw err 
        chai
          .request(server)
          .post('/products')
          .set({ Authorization: `Bearer ${token}` })
          .set('content-type', 'multipart/form-data')
          .field('name', 'post-test')
          .field('description', 'test')
          .field('mainDescription', 'test')
          .field('image', 'Profile')
          .field('brand', 'test')
          .field('price', 23)
          .field('category', `${category._id}`)
          .field('stockCount', 23)
          .field('rating', 5)
          .field('numReviews', 4)
          .field('isFeatured', true)
          .attach(
            'image', 
            fs.readFileSync(`${__dirname}/test-images/Profile.jpg`), 
            'test/test-images/Profile.jpg'
          )
          .end((err, res) => {
            expect(res).to.have.property('statusCode').eql(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('name').eql('post-test')
            expect(res.body).to.have.property('description').eql('test')
            expect(res.body).to.have.property('mainDescription').eql('test')
            expect(res.body).to.have.property('image')
            expect(res.body).to.have.property('brand').eql('test')
            expect(res.body).to.have.property('price').eql(23)
            expect(res.body).to.have.property('category').eql(`${category._id}`)
            expect(res.body).to.have.property('stockCount').eql(23)
            expect(res.body).to.have.property('rating').eql(5)
            expect(res.body).to.have.property('numReviews').eql(4)
            expect(res.body).to.have.property('isFeatured').eql(true)
            done()
          })
      })
    })
    it('should throw an error when posted with false information', () => {
      const fakeProduct = {
        name: 'fake-product',
        description: 'fake-description',
        mainDescription: 123456,
        image: '',
        brand: 'fake-brand',
        price: 23,
        category: '600f17789d422b3337131fake',
        stockCount: 25,
        rating: 5,
        numReviews: 4,
        isFeatured: false
      }
      chai
        .request(server)
        .post('/products')
        .set({ Authorization: `Bearer ${token}` })
        .send(fakeProduct)
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(500)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message').eql('Product cannot be created!')
        })
    })
  })

  /**
   * PUT TESTS
   */
  describe('/PUT /products/:id', () => {
    it('should UPDATE a product', () => {
      let category = new Category({
        name: 'category',
        icon: 'category-icon',
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
      category.save((err, category) => {
        const updatedProduct = {
          name: 'updated-product',
          description: 'updated-description',
          mainDescription: 'new description',
          image: '',
          brand: 'brand',
          price: 29,
          category: `${category._id}`,
          stockCount: 25,
          rating: 5,
          numReviews: 4,
          isFeatured: false
        }
        product.save((err, product) => {
          chai
            .request(server)
            .put(`/products/${product._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send(updatedProduct)
            .end((err, res) => {
              expect(res).to.have.property('statusCode').eql(200)
              expect(res.body).to.be.an('object')
              expect(res.body).to.have.property('name').eql(updatedProduct.name)
              expect(res.body).to.have.property('description').eql(updatedProduct.description)
              expect(res.body).to.have.property('mainDescription').eql(updatedProduct.mainDescription)
              expect(res.body).to.have.property('brand').eql(updatedProduct.brand)
              expect(res.body).to.have.property('price').eql(updatedProduct.price)
            })
        })
      })
    })
    describe('/PUT /products/gallery/:id', () => {
      it('should UPDATE a product with multiple image upload', (done) => {
        let category = new Category({
          name: 'category',
          icon: 'category-icon',
          color: '#fffff',
        })
        category.save((err, category) => {
          let product = new Product({
            name: 'test',
            description: 'test',
            mainDescription: 'test',
            image: '',
            brand: 'test',
            price: 23,
            category: `${category._id}`,
            stockCount: 36,
            rating: 5,
            numReviews: 4,
            isFeatured: true,
            images: []
          })
          product.save((err, product) => {
            chai
              .request(server)
              .put(`/products/gallery/${product._id}`)
              .set({ Authorization: `Bearer ${token}` })
              .set('content-type', 'multipart/form-data')
              .field('name', 'test')
              .field('description', 'test')
              .field('mainDescription', 'test')
              .field('image', 'Profile')
              .field('images', 'Profile', 'Group_38')
              .field('brand', 'test')
              .field('price', 23)
              .field('category', `${category._id}`)
              .field('stockCount', 36)
              .field('rating', 5)
              .field('numReviews', 4)
              .field('isFeatured', true)
              .attach(
                'images', 
                fs.readFileSync(`${__dirname}/test-images/Profile.jpg`), 
                'test/test-images/Profile.jpg'
              )
              .attach(
                'images', 
                fs.readFileSync(`${__dirname}/test-images/Profile.jpg`), 
                'test/test-images/Group_38.jpg'
              )
              .end((err, res) => {
                expect(res).to.have.property('statusCode').eql(200)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('name').eql('test')
                expect(res.body).to.have.property('description').eql('test')
                expect(res.body).to.have.property('mainDescription').eql('test')
                expect(res.body).to.have.property('image')
                expect(res.body).to.have.property('brand').eql('test')
                expect(res.body).to.have.property('price').eql(23)
                expect(res.body).to.have.property('category').eql(`${category._id}`)
                expect(res.body).to.have.property('stockCount').eql(36)
                expect(res.body).to.have.property('rating').eql(5)
                expect(res.body).to.have.property('numReviews').eql(4)
                expect(res.body).to.have.property('isFeatured').eql(true)
                expect(res.body).to.have.property('images')
                done()
              })
          })
        })
      })
    })
    it('should throw an error when given a false id', (done) => {
      let category = new Category({
        name: 'category',
        icon: 'category-icon',
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
      category.save((err, category) => {
        const updatedProduct = {
          name: 'updated-product',
          description: 'updated-description',
          mainDescription: 'new description',
          image: '',
          brand: 'brand',
          price: 29,
          category: `${category._id}`,
          stockCount: 25,
          rating: 5,
          numReviews: 4,
          isFeatured: false
        }
        product.save((err, product) => {
          const fakeId = '600ed7ea059fa61ba4711212'
          chai
            .request(server)
            .put(`/products/${fakeId}`)
            .send(updatedProduct)
            .set({ Authorization: `Bearer ${token}` })
            .end((err, res) => {
              expect(res).to.have.property('statusCode').eql(500)
              expect(res.text).eql('Product cannot be updated!')
              expect(res.body).to.be.an('object')
              done()
            })
        })
      })
    })
  })

  
  /**
   * DELETE REQUESTS
   */
  describe('/DELETE products/:id', () => {
    it('should DELETE a product', (done) => {
      let category = new Category({
        name: 'delete-test',
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
        chai
          .request(server)
          .delete(`/products/${product.id}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res).to.have.property('statusCode').eql(200)
            expect(res.body).to.have.property('message', 'Product deleted successfully!')
            expect(res.body).to.be.an('object')
            done()
          })
      })
    })
    it('should throw an error when given false id', (done) => {
      const fakeId = '600ed7ea059fa61ba4711212'
      chai
        .request(server)
        .delete(`/products/${fakeId}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(404)
          expect(res.body).to.have.property('message').eql('Product could not be deleted!')
          expect(res.body).to.have.property('success').eql(false)
          expect(res.body).to.be.an('object')
          done()
        })
    })
  })
})