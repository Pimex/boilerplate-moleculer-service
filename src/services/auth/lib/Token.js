const jwt = require('jsonwebtoken')

class Token {
  constructor ({ expiresIn = '1h', secret } = {}) {
    this.expiresIn = expiresIn
    this.secret = secret
  }

  sign (payload, { expiresIn = this.expiresIn } = {}) {
    const options = {}

    if (expiresIn) {
      options.expiresIn = expiresIn
    }

    const token = jwt.sign(payload, this.secret, options)

    return token
  }

  verify (token) {
    try {
      const decoded = jwt.verify(token, this.secret)
      decoded.isValid = true

      return decoded
    } catch (error) {
      return this.error(error)
    }
  }

  error (e) {
    e.isValid = false
    return e
  }
}

module.exports = Token
