const expressJWT = require('express-jwt')

function jwtAuth() {
  const token = process.env.TOKEN
  const api = process.env.API_URL

  return expressJWT({
    secret: token,
    algorithms: ['HS256'],
    isRevoked: isRevoked
  })
  .unless({
    path: [
      {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']},
      {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
      {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
      `${api}/users/login`,
      `${api}/users/register`,

    ]
  })
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true)
  }
  done()
}

module.exports = jwtAuth