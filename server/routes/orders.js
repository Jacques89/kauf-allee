/**
 * orders.js
 * @fileoverview Orders routes file in order to perform CRUD actions for orders endpoints
 * @param {Obj} Order is the order placed by the User
 * @author Jacques Nalletamby
 */
const express = require('express')
const router = express.Router()

const { 
  getOrders,
  getOrderId,
  getTotalSales,
  getOrderCount,
  getUserOrderCount,
  postOrders,
  updateOrders,
  deleteOrder
} = require('../controllers/orders')

// GET REQUESTS
router.get(`/`, getOrders)

router.get(`/:id`, getOrderId)

router.get(`/get/totalsales`, getTotalSales)

router.get(`/get/count`, getOrderCount)

router.get(`/get/userorders/:userid`, getUserOrderCount)

// POST REQUESTS
router.post(`/`, postOrders)

// PUT REQUESTS
router.put(`/:id`, updateOrders)

// DELETE REQUESTS
router.delete(`/:id`, deleteOrder)

module.exports = router