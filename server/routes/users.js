/**
 * users.js
 * @fileoverview Users routes file in order to perform CRUD actions for users endpoints
 * @param {Obj} user is the authenticated user making the request
 * @author Jacques Nalletamby
 */

const express = require('express')
const router = express.Router()

const { User } = require('../models/user')

router.get(`/`, async(req, res) => {
  const userList = await User.find()

  if (!userList) {
    res.status(500).json({
      success: false
    })
    res.send(userList)
  }
})

module.exports = router