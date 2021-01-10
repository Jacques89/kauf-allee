/**
 * users.js
 * @fileoverview Users routes file in order to perform CRUD actions for users endpoints
 * @param {Obj} user is the authenticated user making the request
 * @author Jacques Nalletamby
 */

const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const { User } = require('../models/user')

router.get(`/`, async (req, res) =>{
  const userList = await User.find().select('-passwordHash')

  if (!userList) {
    res.status(500).json({
      success: false
    })
  } 
  res.send(userList)
})

router.get('/:id', async(req,res)=>{
  const user = await User.findById(req.params.id).select('-passwordHash')

  if (!user) {
    res.status(500).json({
      message: 'The user ID was not found.'
    })
  } 
  res.status(200).send(user)
})

router.post(`/`, async(req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    postcode: req.body.postcode,
    city: req.body.city,
    country: req.body.country,
  })
  user = await user.save()

  if (!user) {
    return res.status(500).send('User cannot be created!')
  }
  res.send(user)
})

module.exports = router