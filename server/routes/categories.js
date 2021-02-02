/**
 * categories.js
 * @fileoverview catagories routes file in order to perform CRUD actions for catagories endpoints
 * @param {Obj} Category is the category that products belong to
 * @author Jacques Nalletamby
 */
const express = require('express')
const router = express.Router()

const { 
  getCategories, 
  getCategoryId,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categories')

// GET REQUESTS
router.get(`/`, getCategories)

router.get(`/:id`, getCategoryId)

// POST REQUESTS
router.post(`/`, createCategory)

// PUT REQUESTS
router.put(`/:id`, updateCategory)

// DELETE REQUESTS
router.delete(`/:id`, deleteCategory)

module.exports = router