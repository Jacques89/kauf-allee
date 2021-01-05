/**
 * orders.js
 * @fileoverview Orders routes file in order to perform CRUD actions for orders endpoints
 * @author Jacques Nalletamby
 */

const express = require('express')
const router = express.Router()

const { Order } = require('../models/order')

router.get(`/`, async(req, res) => {
  const orderList = await Order.find()

  if (!orderList) {
    res.status(500).json({
      success: false
    })
    res.send(orderList)
  }
})

module.exports = router