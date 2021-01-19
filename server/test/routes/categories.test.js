const chai = require("chai")
const expect = chai.expect
const chaiHttp = require("chai-http")
const mongoose = require("mongoose")

const { Category } = require("../../models/category")

chai.use(chaiHttp);
require("dotenv").config()

describe("Routes", () => {
  /**
   * /GET REQUESTS
   */
  describe("/GET categories", () => {
    it("should GET all the categories", (done) => {
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .get("/categories")
        .end((err, res) => {
          expect(res).to.have.property("statusCode", 200)
          expect(res.body).to.be.an("array")
          expect(res.body.length).to.be.eql(3)
          done();
        });
    });
  });

  describe("/GET categories/:id", () => {
    it("should GET a category ID", (done) => {
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .get("/categories/6006fa5e049e52062be08a7f")
        .end((err, res) => {
          expect(res).to.have.property("statusCode", 200)
          expect(res.body).to.have.property("_id", "6006fa5e049e52062be08a7f")
          expect(res.body).to.be.an("object")
          done()
        })
    })
  })

  /**
   * /POST REQUESTS
   */
  describe("/POST categories", () => {
    let token

    before((done) => {
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .post("/users/login")
        .send({
          email: "test@test.com",
          password: "123456",
        })
        .end((err, res) => {
          if (err) {
            throw err
          }
          token = res.body.token
          done()
        })
    })

    it("should POST a category", (done) => {
      const mockCategory = {
        name: "Test",
        icon: "test-icon",
        color: "#242422",
      };
      chai
        .request(`${process.env.BASE_URL}${process.env.API_URL}`)
        .post("/categories")
        .set({ Authorization: `Bearer ${token}` })
        .send(mockCategory)
        .end((err, res) => {
          expect(res).to.have.property("statusCode", 200)
          expect(res.body).to.be.an("object")
          done()
        })
      after((done) => {
        Category.deleteMany({ name: "Test" }, (err, res) => {
          done()
          console.log(Category)
        })
      })
    })
  })
})
