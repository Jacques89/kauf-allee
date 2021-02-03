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
const { Product } = require('../../models/product')
const { Category} = require('../../models/category')

chai.use(chaiHttp)
require('dotenv').config()

describe('Order Routes', () => {
  const server = `${process.env.BASE_URL}${process.env.API_URL}`

  // Login to enable authenticated routes
  let token
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
   * /GET TESTS
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
      let order = new Order({
        orderItems: [],
        shippingAddress1: "Deutscheweg 28",
        shippingAddress2: "1-A",
        city: "Berlin",
        postcode: "10365",
        country: "Germany",
        phone: "01834758367",
        user: "600ed7ea059fa61ba471d318"
      })
      order.save((err, order) => {
        if (err) throw err
        chai
          .request(server)
          .get(`/orders/${order.id}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res.body).to.be.an('object')
            expect(res).to.have.property('statusCode', 200)
            expect(res.body).to.have.property('id').eql(`${order.id}`)
            done()
          })
      })
    })
  })

  /**
   * /POST TESTS
   */
  describe('/POST orders', () =>{
    it('should POST an order', (done) => {
      let order = new Order({
        orderItems: [],
        shippingAddress1: "Deutscheweg 28",
        shippingAddress2: "1-A",
        city: "Berlin",
        postcode: "10365",
        country: "Germany",
        phone: "01834758367",
        user: "600ed7ea059fa61ba471d318"
      })
      order.save((err, order) => {
        if (err) throw err
        chai
          .request(server)
          .post('/orders')
          .send(order)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            console.log(res)
            expect(res.body).to.be.an('object')
            expect(res).to.have.property('statusCode').eql(200)
            expect(res.body).to.have.property('city').eql('Berlin')
            done()
          })
      })
    })
  })
})