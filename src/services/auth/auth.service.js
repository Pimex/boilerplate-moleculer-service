require('dotenv').config()
const schema = require('./auth.schema')
const Token = require('./lib/Token')

const { AUTH_JWT_SECRET, AUTH_JWT_EXPIRESIN } = process.env

schema.created = async function () {
  this.tokenService = new Token({ expiresIn: AUTH_JWT_EXPIRESIN, secret: AUTH_JWT_SECRET })
}

module.exports = schema
