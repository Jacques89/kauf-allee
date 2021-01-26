const userAuth = () => {
  let token 

  chai
    .request(`${process.env.BASE_URL}${process.env.API_URL}`)
    .post('/users/login')
    .send({
      email: 'test@test.com',
      password: '123456',
    })
    .end((err, res) => {
      if (err) throw err
      token = res.body.token
    })
}

module.exports = userAuth