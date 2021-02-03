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

const { User } = require('../../models/user')

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
        email: 'test@test.com',
        password: '123456',
      })
      .end((err, res) => {
        if (err) throw err
        token = res.body.token
        done()
      })
  })
  // Empty the database
  // after(done => {
  //   User.deleteMany({}, err => {
  //     done()
  //   })
  // })

  describe('/GET users', () => {
    it('should GET all the users', (done) => {
      chai
        .request(server)
        .get('/users')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(200)
          console.log(res.body)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.be.eql(1)
          done()
        })
    })
  })
})
