/**
 * users.js
 * @fileoverview Users routes file in order to perform CRUD actions for users endpoints
 * @param {Obj} user is the authenticated user making the request
 * @author Jacques Nalletamby
 */

const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    return res.status(400).send('User cannot be created!')
  }
  res.send(user)
})

router.post(`/login`, async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  const JWT_TOKEN = process.env.TOKEN

  if (!user) {
    return res.status(400).send('User not found')
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
      }, 
      JWT_TOKEN, { expiresIn: '1d' }
    )
    
    res.status(200).send({ user: user.email, token: token })
  } else {
    res.status(400).send('Login failed')
  }
  
})

module.exports = router