const Account = require('../lib/Account')

module.exports = {
  async createToken ({ params }) {
    return this.createToken(params)
  },
  async createAccountToken ({ params }) {
    return this.createAccountToken(params)
  },
  async addAccount ({ params }) {
    return this.createAccount(params)
  },
  getAllAccounts: {
    rest: 'GET /accounts',
    async handler () {
      return await Account.getAll()
    }
  },
  getAccountById: {
    rest: 'GET /accounts/:id',
    async handler ({ params }) {
      const { id, sub } = params
      const account = new Account({ id, sub })
      return account.get({ required: true })
    }
  },
  deleteAccount: {
    rest: 'DELETE /accounts/:id',
    async handler ({ params }) {
      const { id, sub } = params
      const account = new Account({ id, sub })
      const accountData = await account.delete()

      this.broker.emit('auth.accounts.deleted', {
        id: accountData.id
      })

      return accountData
    }
  },
  getTokenData: {
    rest: 'POST /tokens',
    async handler ({ params }) {
      return this.getTokenData(params)
    }
  }
}

/**
  addRole: {
    rest: 'POST /roles',
    async handler ({ params }) {
      const res = await Role.add(params)
      this.broker.emit('auth.roles.created', {
        id: res.id
      })
      return res
    }
  },
  removeRole: {
    rest: 'DELETE /roles/:id',
    async handler ({ params }) {
      const { id } = params
      const res = await new Role(id).delete()
      this.broker.emit('auth.roles.removed', {
        id: res.id,
        slug: res.slug
      })
      return res
    }
  },
  updateRole: {
    rest: 'PUT /roles/:id',
    async handler ({ params }) {
      const { id } = params
      const res = await new Role(id).update(params)

      this.broker.emit('auth.roles.updated', {
        id: res._id
      })
      return res
    }
  },
  getRoleById: {
    rest: 'GET /roles/:id',
    async handler ({ params }) {
      const { id = null } = params
      return await new Role(id).get({ required: true })
    }
  },
  getAllRole: {
    rest: 'GET /roles',
    async handler ({ params }) {
      const { limit } = params
      const query = {}
      if (limit) query.limit = limit
      return await Role.getAll({ query })
    }
  },
  addRolesToAccount: {
    rest: 'POST /accounts/:id/roles',
    async handler ({ params }) {
      const { id, roles } = params

      for (const role of roles) {
        try {
          await new Role(role).get({ required: true })
        } catch (error) {
          throw badRequest(error.message)
        }
      }

      const account = await new Account(id).get({ required: true })

      let rolesArr = []
      if (account.roles && account.roles.length) {
        const rolesToInclude = roles.filter(r => !account.roles.includes(r))
        rolesArr = [...rolesToInclude, ...account.roles]
      }

      const accountUpdate = {
        roles: rolesArr.length ? rolesArr : roles
      }

      const response = new Account(id).update(accountUpdate)

      this.broker.emit('account.roles.updated', {
        id,
        roles: rolesArr.length ? rolesArr : roles
      })

      return response
    }
  },

 *
 */
