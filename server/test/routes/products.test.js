process.env.NODE_ENV = 'test'

const express = require('express')
const mongoose = require("mongoose")
const productRoute = require('../../routes/products')
const { Product } = require('../../models/product')
// const router = express.Router()
const request = require('supertest')

//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect


chai.use(chaiHttp)

function sum(a, b) {
  return a + b;
}

describe('sum function', () => {
  it('sums up two integers', () => {
    expect(sum(1, 2)).to.eql(3)
  })
})
