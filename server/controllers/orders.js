/**
 * orders.js
 * @fileoverview Orders routes file in order to perform CRUD actions for orders endpoints
 * @param {Obj} Order is the order placed by the User
 * @param {Obj} OrderItem is an object containing the item within the Order Object
 * @author Jacques Nalletamby
 */

const { Order } = require('../models/order')
const { OrderItem } = require('../models/order-item')

/**
 * GET CONTROLLERS
 */

 /**
 * @apiName GetOrders
 * @api {get} /orders
 * @apiDescription Get the Order information
 * @apiGroup Orders
 * @apiPermission admin
 * @apiSuccess {Object[]} orderItems List of items the User ordered
 * @apiSuccess {String} status The status of the Order
 * @apiSuccess {String} shippingAddress1 The first line of the shipping address
 * @apiSuccess {String} shippingAddress2 The second line of the shipping address
 * @apiSuccess {String} city The city provided by the User
 * @apiSuccess {String} postcode The postcode provided by the User
 * @apiSuccess {String} country The country provided by the User
 * @apiSuccess {String} phone The phone number provided by the User
 * @apiSuccess {Object} user The id of the User that made the Order
 * @apiSuccess {Date} dateOrdered The date the Order was placed
 * @apiSuccess {String} id The Order Id
 * @apiError NoAccessRights (401) User is not authorized
 */
exports.getOrders = async(req, res) => {
  const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1})

  if (!orderList) {
    res.status(500).json({
      success: false
    })
  }
  res.send(orderList)
}

/**
 * @apiName GetOrderId
 * @api {get} /orders/:id
 * @apiDescription Get the Order Id
 * @apiParams {String} id The Order Id
 * @apiGroup Orders
 * @apiPermission admin
 * @apiSuccess {Object[]} orderItems List of items the User ordered
 * @apiSuccess {String} status The status of the Order
 * @apiSuccess {String} shippingAddress1 The first line of the shipping address
 * @apiSuccess {String} shippingAddress2 The second line of the shipping address
 * @apiSuccess {String} city The city provided by the User
 * @apiSuccess {String} postcode The postcode provided by the User
 * @apiSuccess {String} country The country provided by the User
 * @apiSuccess {String} phone The phone number provided by the User
 * @apiSuccess {Object} user The id of the User that made the Order
 * @apiSuccess {Date} dateOrdered The date the Order was placed
 * @apiSuccess {String} id The Order Id
 * @apiError NoAccessRights 401 User is not authorized
 */
exports.getOrderId = async(req, res) => {
  const order = await Order
  .findById(req.params.id)
  .populate('user', 'name')
  .populate({ 
    path: 'orderItems', 
    populate: {
      path: 'product',
      populate: 'category'
    } 
  })

  if (!order) {
    res.status(500).json({
      success: false
    })
  }
  res.send(order)
}

/**
 * @apiName GetTotalSales
 * @api {get} /orders/get/totalsales
 * @apiDescription Get the total sales sum
 * @apiGroup Orders
 * @apiPermission admin
 * @apiSuccess {Number} totalSales The Total sales of purchases
 * @apiError NoAccessRights 401 User is not authorized
 */
exports.getTotalSales = async(req, res) => {
  const totalSales = await Order.aggregate([
    { 
      $group: { 
        _id: null, 
        totalsales: { 
          $sum: '$totalPrice' 
        } 
      } 
    }
  ])

  if (!totalSales) {
    return res.status(400).send('The total sales cannot be generated')
  }
  res.send({ totalsales: totalSales.pop().totalsales })
}

/**
 * @apiName GetOrderCount
 * @api {get} /get/count 
 * @apiDescription Get the overall Order quantity
 * @apiGroup Orders
 * @apiPermission admin
 * @apiSuccess {Number} orderCount The quantity of overall Orders
 * @apiError OrderCountNotFound (500) The Order count could not be retrieved
 */
exports.getOrderCount = async(req, res) => {
  const orderCount = await Order.countDocuments(count => count)

  if (!orderCount) {
    res.status(500).json({
      success: false
    })
  }
  res.send({
    orderCount: orderCount
  })
}

/**
 * @apiName GetUserOrderCount
 * @api {get} /get/userorders/:userid
 * @apiDescription Get the quantity of user Orders
 * @apiGroup Orders
 * @apiPermission none
 * @apiSuccess {Object[]} orderItems The quantity of overall Orders made by the User
 * @apiError OrderCountNotFound (500) The Order count could not be retrieved
 */
exports.getUserOrderCount = async(req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
  .populate({ 
    path: 'orderItems', 
    populate: {
      path: 'product',
      populate: 'category'
    } 
  })
  .sort({ dateOrdered: -1 })

  if (!userOrderList) {
    res.status(500).json({
      success: false
    })
  }
  res.send(userOrderList)
}

/**
 * POST CONTROLLERS
 */

 /**
 * @apiName PostOrders
 * @api {post} /orders
 * @apiDescription Create a new Order
 * @apiGroup Orders
 * @apiPermission admin
 * @apiSuccess {Object[]} orderItems Array of Order items the user ordered
 * @apiSuccess {String} status The status of the Order
 * @apiSuccess {String} shippingAddress1 The first line of the shipping address
 * @apiSuccess {String} shippingAddress2 The second line of the shipping address
 * @apiSuccess {String} city The city provided by the User
 * @apiSuccess {String} postcode The postcode provided by the User
 * @apiSuccess {String} country The country provided by the User
 * @apiSuccess {String} phone The phone number provided by the User
 * @apiSuccess {Object} user The id of the User that made the Order
 * @apiSuccess {Date} dateOrdered The date the Order was placed
 * @apiSuccess {String} id The Order Id
 */
exports.postOrders = async(req, res) => {
  const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product
    })
    newOrderItem = await newOrderItem.save()

    return newOrderItem._id
  }))
  const orderItemIdsResolved = await orderItemsIds

  const totalPrices = await Promise.all(orderItemIdsResolved.map(async orderItemId => {
    const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
    const totalPrice = orderItem.product.price * orderItem.quantity

    return totalPrice
  }))

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0)

  let order = new Order({
    orderItems: orderItemIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    postcode: req.body.postcode,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user
  })
  order = await order.save()

  if (!order) {
    return res.status(400).send('Order cannot be created!')
  }
  res.send(order)
}

/**
 * PUT CONTROLLERS
 */

 /** 
 * @apiName UpdateOrder
 * @api {get} /orders/:id
 * @apiDescription Update an existing Order
 * @apiParams {String} id The Order Id
 * @apiGroup Orders
 * @apiPermission admin
 * @apiSuccess {Object[]} orderItems List of items the User ordered
 * @apiSuccess {String} status The status of the Order
 * @apiSuccess {String} shippingAddress1 The first line of the shipping address
 * @apiSuccess {String} shippingAddress2 The second line of the shipping address
 * @apiSuccess {String} city The city provided by the User
 * @apiSuccess {String} postcode The postcode provided by the User
 * @apiSuccess {String} country The country provided by the User
 * @apiSuccess {String} phone The phone number provided by the User
 * @apiSuccess {Object} user The id of the User that made the Order
 * @apiSuccess {Date} dateOrdered The date the Order was placed
 * @apiSuccess {String} id The Order Id
 * @apiError NoAccessRights (401) User is not authorized
 */
exports.updateOrders = async(req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status
    },
    { new: true }
  )
  if (!order) {
    return res.status(404).send('Order cannot be updated!')
  }
  res.send(order)
}

/**
 * DELETE CONTROLLERS
 */

 /**
 * @apiName DeleteOrder
 * @api {delete} /orders/:id
 * @apiDescription Delete an existing Order
 * @apiParam {String} id String value of the category ID
 * @apiGroup Orders
 * @apiPermission admin
 * @apiError OrderNotDeleted (404) The Order could not be deleted
 */
exports.deleteOrder = (req, res) => {
  Order.findByIdAndRemove(req.params.id)
  .then(async order => {
    if (order) {
      await order.orderItems.map(async orderItem => {
        await OrderItem.findByIdAndRemove(orderItem)
      })
      return res.status(200).json({
        success: true,
        message: 'Order deleted successfully!'
      })
    } else {
      return res.status(404).json({
        success: false,
        message: 'Order could not be deleted!'
      })
    }
  })
  .catch(err => {
    return res.status(400).json({
      success: false,
      error: err
    })
  })
}