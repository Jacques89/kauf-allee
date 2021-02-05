/**
 * categories.tests.js 
 * @fileoverview Test routes for categories
 * @author Jacques Nalletamby
 */

process.env.NODE_ENV = 'test'

const chai = require('chai')
const { expect } = chai

const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const app = require('../app')

const { Category } = require('../models/category')

chai.use(chaiHttp)
require('dotenv').config()

describe('Category Routes', () => {
  const server = `${process.env.BASE_URL}${process.env.API_URL}`
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
        .request(server)
        .get('/categories')
        .end((err, res) => {
          expect(res).to.have.property('statusCode', 200)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.be.eql(0)
          done()
        })
    })
  })

  describe('/GET/:id categories', () => {
    it('should GET a category given the id', (done) => {
      let category = new Category({
        name: 'test',
        icon: 'test-icon',
        color: '#fffff',
      })
      category.save((err, category) => {
        if (err) throw err
        chai
          .request(server)
          .get(`/categories/${category._id}`)
          .end((err, res) => {
            expect(res.body).to.be.an('object')
            expect(res).to.have.property('statusCode').eql(200)
            expect(res.body).to.have.property('_id').eql(`${category._id}`)
            done()
          })
      })
    })
    it('should show an error message given a false id', (done) => {
      const fakeId = '600ed7ea059fa61ba4711232'
      chai
        .request(server)
        .get(`/categories/${fakeId}`)
        .end((err, res) => {
          expect(res.body).to.be.an('object')
          expect(res).to.have.property('statusCode').eql(500)
          expect(res.body).to.have.property('message').eql('Category ID was not found')
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
    it('should CREATE a category', (done) => {
      const category = {
        name: 'Test',
        icon: 'test-icon',
        color: '#242422',
      }
      chai
        .request(server)
        .post('/categories')
        .set({ Authorization: `Bearer ${token}` })
        .send(category)
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('name').eql(category.name)
          expect(res.body).to.have.property('icon').eql(category.icon)
          expect(res.body).to.have.property('color').eql(category.color)
          expect(res.body).to.have.property('_id')
          done()
        })
    })
    it('should throw an error when posted with false information', () => {
      const falseCategory = {
        number: 123,
        icon: 'test-icon',
        color: '#242422',
      }
      chai
        .request(server)
        .post('/categories')
        .set({ Authorization: `Bearer ${token}` })
        .send(falseCategory)
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(500)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message').eql('Category cannot be created!')
        })
    })
  })
  /**
   * PUT REQUESTS
   */
  describe('/PUT categories/:id', () => {
      let token

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
    it('should UPDATE a category given the id', (done) => {
      let category = new Category({
        name: 'update-test',
        icon: 'test-icon',
        color: '#fffff',
      })
      const updatedCategory = {
        name: 'updated-test',
        icon: 'test-icon',
        color: '#fffff',
      }
      category.save((err, category) => {
        if (err) throw err
        chai
          .request(server)
          .put(`/categories/${category._id}`)
          .set({ Authorization: `Bearer ${token}` })
          .send(updatedCategory)
          .end((err, res) => {
            expect(res).to.have.property('statusCode').eql(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('name').eql(updatedCategory.name)
            done()
          })
      })
    })
    it('should throw an error when provided with a false id', (done) => {
      let category = new Category({
        name: 'update-test',
        icon: 'test-icon',
        color: '#fffff',
      })
      const fakeUpdatedCategory = {
        number: 123456,
        icon: 'test-icon',
        color: '#fffff',
      }
      const fakeId = '600ed7ea059fa61ba4711232'
      category.save((err, category) => {
        if (err) throw err
        chai
          .request(server)
          .put(`/categories/${fakeId}`)
          .set({ Authorization: `Bearer ${token}` })
          .send(fakeUpdatedCategory)
          .end((err, res) => {
            expect(res).to.have.property('statusCode').eql(404)
            expect(res.body).to.be.an('object')
            expect(res.text).eql('Category cannot be updated!')
            done()
          })
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
    it('should DELETE a category given the id', (done) => {
      let category = new Category({
        name: 'delete-test',
        icon: 'test-icon',
        color: '#fffff',
      })
      category.save((err, category) => {
        if (err) throw err
        chai
        .request(server)
        .delete(`/categories/${category._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(200)
          expect(res.body).to.have.property('message').eql('Category deleted successfully!')
          expect(res.body).to.have.property('success').eql(true)
          expect(res.body).to.be.an('object')
          done()
        })
      })
    })
    it('should throw an error when given false id', (done) => {
      const fakeId = '600ed7ea059fa61ba4711232'
      chai
        .request(server)
        .delete(`/categories/${fakeId}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(404)
          expect(res.body).to.have.property('message').eql('Category could not be deleted!')
          expect(res.body).to.have.property('success').eql(false)
          expect(res.body).to.be.an('object')
          done()
        })
    })
  })
})


