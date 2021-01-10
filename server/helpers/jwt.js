const expressJWT = require('express-jwt')

function jwtAuth() {
  const token = process.env.TOKEN
  return expressJWT({
    secret: token,
    algorithms: ['HS256']
  })
}

module.exports = jwtAuth