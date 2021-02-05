/**
 * users.tests.js 
 * @fileoverview Test routes for users
 * @author Jacques Nalletamby
 */

process.env.NODE_ENV = 'test'

const chai = require('chai')

const { expect } = chai
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const { User } = require('../models/user')

chai.use(chaiHttp)
require('dotenv').config()

describe('User Routes', () => {
  const server = `${process.env.BASE_URL}${process.env.API_URL}`

  let token
  // Login to enable authenticated routes
  beforeEach((done) => {
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
  afterEach((done) => {
    User.deleteMany({ email: 'testuser@test.com' }, err => {
      done()
    })
  })

  /**
   * GET TESTS
   */
  describe('/GET /users/', () => {
    it('should GET all the users', (done) => {
      chai
        .request(server)
        .get('/users')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(200)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.be.eql(1)
          done()
        })
    })
  })

  describe('/GET /users/:id', () => {
    it('should get a user given the id', (done) => {
      let user = new User({
        name: 'test-user',
        email: 'testuser@test.com',
        passwordHash: bcrypt.hashSync('test123456'),
        phone: '012343748384',
        isAdmin: false,
        street: 'test street 123',
        apartment: '7357',
        postcode: '14054',
        city: 'testington',
        country: 'Testland'
      })
      user.save((err, user) => {
        if (err) throw err
        chai
          .request(server)
          .get(`/users/${user._id}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res).to.have.property('statusCode').eql(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.property('name').eql(user.name)
            expect(res.body).to.have.property('email').eql(user.email)
            expect(res.body).to.have.property('phone').eql(user.phone)
            expect(res.body).to.have.property('isAdmin').eql(user.isAdmin)
            expect(res.body).to.have.property('street').eql(user.street)
            expect(res.body).to.have.property('apartment').eql(user.apartment)
            expect(res.body).to.have.property('postcode').eql(user.postcode)
            expect(res.body).to.have.property('city').eql(user.city)
            expect(res.body).to.have.property('country').eql(user.country)
            expect(res.body).to.have.property('id')
            done()
          })
      })
    })
    it('should throw an error given a false id', (done) => {
      const fakeUserId = '600ed7ea059fa61ba4711232' 
      chai
        .request(server)
        .get(`/users/${fakeUserId}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(500)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('message').eql('The user ID was not found.')
          done()
        })
    })
  })

  describe('/GET /users/get/count', () => {
    it('should get a count of users', (done) => {
      chai
        .request(server)
        .get('/users/get/count')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('userCount').eql(1)
          done()
        })
    })
  })

  /**
   * POST TESTS
   */
  describe('/POST /users', () => {
    it('should CREATE a user', () => {
      const user = {
        name: 'test-user',
        email: 'testuser@test.com',
        passwordHash: bcrypt.hashSync('test123456'),
        phone: '012343748384',
        isAdmin: false,
        street: 'test street 123',
        apartment: 'gle',
        postcode: '14054',
        city: 'testington',
        country: 'Testland'
      }
      chai
        .request(server)
        .post('/users')
        .send(user)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('name').eql(user.name)
          expect(res.body).to.have.property('email').eql(user.email)
          expect(res.body).to.have.property('phone').eql(user.phone)
          expect(res.body).to.have.property('isAdmin').eql(user.isAdmin)
          expect(res.body).to.have.property('street').eql(user.street)
          expect(res.body).to.have.property('apartment').eql(user.apartment)
          expect(res.body).to.have.property('postcode').eql(user.postcode)
          expect(res.body).to.have.property('city').eql(user.city)
          expect(res.body).to.have.property('country').eql(user.country)
          expect(res.body).to.have.property('id')
        })
    })
  })

  describe('/POST /users/login', () => {
    it('should login a user', (done) => {
      const userLogin = {
        email: 'testadmin@test.com',
        password: '123456'
      }
      chai
        .request(server)
        .post('/users/login')
        .send(userLogin)
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('user').eql(`${userLogin.email}`)
          expect(res.body).to.have.property('token')
          done()
        })
    })
  })

  describe('/POST /users/register', () => {
    it('should signup a user', () => {
      const userSignUp = {
        name: 'test-user',
        email: 'testuser@test.com',
        passwordHash: bcrypt.hashSync('test123456'),
        phone: '012343748384',
        isAdmin: false,
        street: 'test street 123',
        apartment: 'gle',
        postcode: '14054',
        city: 'testington',
        country: 'Testland',
      }
      chai
        .request(server)
        .post('/users/register')
        .send(userSignUp)
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('name').eql(userSignUp.name)
          expect(res.body).to.have.property('email'),eql(userSignUp.email)
          expect(res.body).to.have.property('password').eql(userSignUp.passwordHash)
          expect(res.body).to.have.property('phone').eql(userSignUp.phone)
          expect(res.body).to.have.property('isAdmin').eql(userSignUp.isAdmin)
          expect(res.body).to.have.property('street').eql(userSignUp.street)
          expect(res.body).to.have.property('apartment').eql(userSignUp.apartment)
          expect(res.body).to.have.property('postcode').eql(userSignUp.postcode)
          expect(res.body).to.have.property('city').eql(userSignUp.city)
          expect(res.body).to.have.property('country').eql(userSignUp.country)
        })
    })
  })

  /**
   * DELETE TESTS
   */
  describe('/DELETE /users/:id', () => {
    it('should delete a user', (done) => {
      let user = new User({
        name: 'test-user',
        email: 'testuser@test.com',
        passwordHash: bcrypt.hashSync('test123456'),
        phone: '012343748384',
        isAdmin: false,
        street: 'test street 123',
        apartment: '7357',
        postcode: '14054',
        city: 'testington',
        country: 'Testland'
      })
      user.save((err, user) => {
        chai
          .request(server)
          .delete(`/users/${user._id}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res).to.have.property('statusCode').eql(200)
            expect(res.body).to.have.property('success').eql(true)
            expect(res.body).to.have.property('message').eql('User deleted successfully!')
            done()
          })
      })
    })
    it('should throw an error given a false id', (done) => {
      const fakeUserId = '600ed7ea059fa61ba4711232' 
      chai
        .request(server)
        .delete(`/users/${fakeUserId}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(404)
          expect(res.body).to.have.property('success').eql(false)
          expect(res.body).to.have.property('message').eql('User could not be deleted!')
          done()
        })
    })
  })
})
