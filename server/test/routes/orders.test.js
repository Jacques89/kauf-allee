/**
 * orders.tests.js 
 * @fileoverview Test routes for orders
 * @author Jacques Nalletamby
 */

process.env.NODE_ENV = 'test'

const chai = require('chai')

const { expect } = chai
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')

const { Order } = require('../../models/order')
const { OrderItem } = require('../../models/order-item')

chai.use(chaiHttp)
require('dotenv').config()

describe('Order Routes', () => {
  const server = `${process.env.BASE_URL}${process.env.API_URL}`

  // Login to enable authenticated routes
  let token
  before((done) => {
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
  after(done => {
    Order.deleteMany({}, err => {
      done()
    })
  })
  after(done => {
    OrderItem.deleteMany({}, err => {
      done()
    })
  })

  /**
   * /GET REQUESTS
   */
  describe('/GET orders', () => {
    it('should GET all the orders', (done) => {
      chai
        .request(server)
        .get('/orders')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.property('statusCode', 200)
          expect(res.body).to.be.an('array')
          expect(res.body.length).to.be.eql(0)
          done()
        })
    })
  })
  describe('/GET orders/:id', () => {
    it('should get an order given an id', (done) => {
      // TODO write logic for test
    })
  })
})