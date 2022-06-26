const Account = require('../lib/Account')

module.exports = {
  async getAccount ({ id, required = true }) {
    return new Account(id).get({ required })
  },
  async createAccount (accountData) {
    return await Account.add(accountData)
  },
  async senEmail (params) {
    // const emailMessage = this.broker.call('emails.send', params)

    return true
  },
  getTokenData ({ token }) {
    return this.tokenService.verify(token)
  },
  async createAccountToken ({ id, sub, expiresIn, type }) {
    const { sub: accountSub } = await new Account({ id, sub }).get({ required: true })

    const token = await this.createToken({
      expiresIn,
      type,
      params: {
        sub: accountSub,
        account: id
      }
    })

    return token
  },
  async createToken ({ expiresIn = '1h', type = 'basic', params = {} } = {}) {
    return this.tokenService.sign({
      ...params,
      type
    }, { expiresIn })
  }
}

/*
async getScopes (roles) {
    let scopesArr = []
    for (const role of roles) {
      try {
        const res = await new Role(role).get({ required: true })
        const scopesToInclude = res.scopes.filter(s => !scopesArr.includes(s))
        scopesArr = [...scopesToInclude, ...scopesArr]
      } catch (error) {
        console.log(error)
      }
    }
    return scopesArr
  },
**/
