const sinon = require('sinon')
const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')

const  getCategories  = require('../../controllers/categories')
const { Category } = require('../../models/category')

chai.use(chaiHttp)
// //Our parent block
// describe('Categories', () => {
//   beforeEach((done) => { //Before each test we empty the database
//     Category.remove({}, (err) => {
//       done()
//     })
//   })
// })

describe('Routes', function() {
  describe('/GET categories', () => {
    it('it should GET all the categories', (done) => {
      chai.request('http://localhost:3000/api/v1')
      .get('/categories')
      .end((err, res) => {
        expect(res).to.have.property('statusCode', 200)
        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.eql(4)
        done()
      })
    })
  })
})
