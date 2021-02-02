/**
 * users.js
 * @fileoverview Users routes file in order to perform CRUD actions for users endpoints
 * @param {Obj} User 
 * @author Jacques Nalletamby
 */
const express = require('express')
const router = express.Router()

const { 
  getUsers, 
  getUserId,
  getUserCount,
  postUser, 
  postUserLogin,
  postUserRegister,
  deleteUser
} = require('../controllers/users')

// GET REQUESTS
router.get(`/`, getUsers)

router.get('/:id', getUserId)

router.get(`/get/count`, getUserCount)

// POST REQUESTS
router.post(`/`, postUser)

router.post(`/login`, postUserLogin)

router.post(`/register`, postUserRegister)

// DELETE REQUESTS
router.delete(`/:id`, deleteUser)

module.exports = router