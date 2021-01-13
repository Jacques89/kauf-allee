/**
 * orders.js
 * @fileoverview Orders routes file in order to perform CRUD actions for orders endpoints
 * @param {Obj} Order is the order placed by the User
 * @author Jacques Nalletamby
 */
const express = require('express')
const router = express.Router()

const { Order } = require('../models/order')
const { OrderItem } = require('../models/order-item')

// GET REQUESTS
/**
 * @apiName GetOrders
 * @api {get} /orders
 * @apiDescription Get the Order information
 * @apiGroup Orders
 * @apiPermission admin
 * @apiSuccess {String[]} orderItems Array of Order items the user ordered
 * @apiSuccess {String} status The status of the Order
 * @apiSuccess {String} shippingAddress1 The first line of the shipping address
 * @apiSuccess {String} shippingAddress2 The second line of the shipping address
 * @apiSuccess {String} city The city provided by the User
 * @apiSuccess {String} postcode The postcode provided by the User
 * @apiSuccess {String} country The country provided by the User
 * @apiSuccess {String} phone The phone number provided by the User
 * @apiSuccess {String} user The id of the User that made the Order
 * @apiSuccess {Date} dateCreated The date the Order was placed
 * @apiError NoAccessRights (401) User is not authorized
 */
router.get(`/`, async(req, res) => {
  const orderList = await Order.find()

  if (!orderList) {
    res.status(500).json({
      success: false
    })
  }
  res.send(orderList)
})

// POST REQUESTS
/**
 * @apiName PostOrders
 * @api {post} /orders
 * @apiDescription Create a new Order
 * @apiGroup Orders
 * @apiPermission admin
 * @apiSuccess {Obj[]} orderItems Array of Order items the user ordered
 * @apiSuccess {String} status The status of the Order
 * @apiSuccess {String} shippingAddress1 The first line of the shipping address
 * @apiSuccess {String} shippingAddress2 The second line of the shipping address
 * @apiSuccess {String} city The city provided by the User
 * @apiSuccess {String} postcode The postcode provided by the User
 * @apiSuccess {String} country The country provided by the User
 * @apiSuccess {String} phone The phone number provided by the User
 * @apiSuccess {String} user The id of the User that made the Order
 * @apiSuccess {Date} dateCreated The date the Order was placed
 */
router.post(`/`, async(req, res) => {
  const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product
    })
    newOrderItem = await newOrderItem.save()

    return newOrderItem._id
  }))
  const orderItemIdsResolved = await orderItemsIds

  let order = new Order({
    orderItems: orderItemIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    postcode: req.body.postcode,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user
  })
  order = await order.save()

  if (!order) {
    return res.status(400).send('Order cannot be created!')
  }
  res.send(order)
})

module.exports = router