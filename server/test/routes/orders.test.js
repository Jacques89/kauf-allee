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
    it('should GET an order given an order id', (done) => {
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
    it('should throw an error message when an incorrect order id is given', (done) => {
      const fakeId = '600ed7ea059fa61ba4711232'
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
          .get(`/orders/${fakeId}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res.body).to.be.an('object')
            expect(res).to.have.property('statusCode', 500)
            expect(res.body).to.have.property('success').eql(false)
            done()
          })
      })
    })
    it('should GET an order, given the user id', (done) => {
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
          .get(`/orders/get/userorders/${order.user}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res.body).to.be.an('array')
            expect(res).to.have.property('statusCode', 200)
            done()
          })
      })
    })
    it('should throw an error when an incorrect user id is given', (done) => {
      const fakeUserId = '600ed7ea059fa61ba4719999'
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
          .get(`/orders/${fakeUserId}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res.body).to.be.an('object')
            expect(res).to.have.property('statusCode', 500)
            expect(res.body).to.have.property('success').eql(false)
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
            expect(res.body).to.be.an('object')
            expect(res).to.have.property('statusCode').eql(200)
            expect(res.body).to.have.property('city').eql('Berlin')
            done()
          })
      })
    })
    it('should throw an error when incorrect information is given', () => {
      const fakeOrder = {
        orderItems: [],
        mainAddress: "Deutscheweg 28",
        shippingAddress2: "1-A",
        city: "Berlin",
        postcode: "10365",
        country: "Germany",
        fakeNumber: "01834758367",
        user: "600ed7ea059fa61ba471d318"
      }
      chai
        .request(server)
        .post('/orders')
        .set({ Authorization: `Bearer ${token}` })
        .send(fakeOrder)
        .end((err, res) => {
          console.log(res)
          expect(res.body).to.be.an('object')
          expect(res).to.have.property('statusCode').eql(500)
          expect(res.body).to.have.property('success').eql(false)
        })
    })
  })

  /**
   * PUT TESTS
   */
  describe('/PUT orders/:id', () =>{
    it('should UPDATE an order status given the id', (done) => {
      // order status' are automatically set to pending when created
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
      const updatedOrder = {
        status: 'shipped'
      }
      order.save((err, order) => {
        if (err) throw err
        chai
          .request(server)
          .put(`/orders/${order._id}`)
          .set({ Authorization: `Bearer ${token}` })
          .send(updatedOrder)
          .end((err, res) => {
            expect(res.body).to.be.an('object')
            expect(res).to.have.property('statusCode').eql(200)
            expect(res.body).to.have.property('status').eql('shipped')
            done()
          })
      })
    })
    it('should throw an error when given a false id', (done) => {
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
      const fakeUpdatedOrder = {
        status: 'shipped'
      }
      const fakeId = '600ed7ea059fa61ba4713456'
      order.save((err, order) => {
        if (err) throw err
        chai
          .request(server)
          .put(`/orders/${fakeId}`)
          .set({ Authorization: `Bearer ${token}` })
          .send(fakeUpdatedOrder)
          .end((err, res) => {
            expect(res).to.have.property('statusCode').eql(404)
            expect(res.body).to.be.an('object')
            expect(res.text).eql('Order cannot be updated!')
            done()
          })
      })
    })
  })

  /**
   * DELETE TESTS
   */
  describe('/DELETE orders/:id', () => {
    it('should DELETE an order given the order id', (done) => {
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
          .delete(`/orders/${order.id}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res).to.have.property('statusCode').eql(200)
            expect(res.body).to.have.property('success').eql(true)
            expect(res.body).to.have.property('message').eql('Order deleted successfully!')
            done()
          })
      })
    })
    it('should throw an error when given a false id', done => {
      const fakeId = '600ed7ea059fa61ba4712222'
      chai
        .request(server)
        .delete(`/orders/${fakeId}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          expect(res).to.have.property('statusCode').eql(404)
          expect(res.body).to.have.property('message').eql('Order could not be deleted!')
          expect(res.body).to.have.property('success').eql(false)
          expect(res.body).to.be.an('object')
          done()
        })
    })
  })
})