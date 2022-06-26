const { MongoMemoryServer } = require('mongodb-memory-server')
const { ServiceBroker } = require('moleculer')
const { v4: uuid } = require('uuid')
const Db = require('../../../../lib/Db')
const authServiceSchema = require('../../auth.schema')
const TokenService = require('../../lib/Token')

describe('Integrations test to users service', () => {
  let mongod = null
  let newAccount = null

  const onAuthAccountsDeletedMock = jest.fn()

  authServiceSchema.created = async function () {
    this.tokenService = new TokenService({ secret: uuid() })
  }

  authServiceSchema.events['auth.accounts.deleted'] = {
    handler: onAuthAccountsDeletedMock
  }

  const broker = new ServiceBroker({ logger: false })

  const newAccountData = { sub: uuid() }

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await Db.connect({ uri })
    broker.createService(authServiceSchema)
    await broker.start()
    newAccount = await broker.call('auth.addAccount', newAccountData)
  })

  describe('Test auth.getAllAccounts action', () => {
    it('Shoud return an array with a list of accounts', async () => {
      const accounts = await broker.call('auth.getAllAccounts')
      expect(Array.isArray(accounts)).toBeTruthy()
    })
  })

  describe('Test auth.addAccount action', () => {
    const newAccountData = { sub: uuid() }

    it('Shoud return a sub required error', async () => {
      try {
        await broker.call('auth.addAccount', {
          metadata: { test: 1 }
        })
      } catch (error) {
        expect(error.message).toBe('Account validation failed: sub: Path `sub` is required.')
      }
    })

    it('Shoud create new account', async () => {
      const newAccount = await broker.call('auth.addAccount', newAccountData)

      expect(newAccount.id).toBeTruthy()

      const accountData = await broker.call('auth.getAccountById', { id: newAccount.id })

      expect(accountData.id).toEqual(newAccount.id)
      expect(accountData.sub).toBe(newAccountData.sub)
    })
  })

  describe('Test auth.getAccountById action', () => {
    it('Shoud return account object by Id', async () => {
      const accountData = await broker.call('auth.getAccountById', { id: newAccount.id })

      expect(accountData.id).toBe(newAccount.id)
      expect(accountData.sub).toBe(newAccountData.sub)
    })

    it('Shoud return account object by sub', async () => {
      const accountData = await broker.call('auth.getAccountById', { sub: newAccountData.sub })

      expect(accountData.id).toBe(newAccount.id)
      expect(accountData.sub).toBe(newAccountData.sub)
    })

    it('Shoud return an bad request error', async () => {
      try {
        await broker.call('auth.getAccountById', { testId: newAccount.id })
      } catch (error) {
        expect(error.message).toBe('Invalid Account Id')
      }
    })

    it('Shoud return an bad request error', async () => {
      try {
        await broker.call('auth.getAccountById', {})
      } catch (error) {
        expect(error.message).toBe('Invalid Account Id')
      }
    })
  })

  describe('Test auth.createToken action', () => {
    it('Shoud return a jwt token', async () => {
      const token = await broker.call('auth.createToken', newAccountData)

      expect(token).toBeTruthy()
    })
  })

  describe('Test account.deleteAccount action', () => {
    const newAccountData = {
      sub: uuid()
    }

    it('Shoud remove account By id', async () => {
      const newAccount = await broker.call('auth.addAccount', newAccountData)

      await broker.call('auth.deleteAccount', { id: newAccount.id })
    })

    it('Shoud return an not found error', async () => {
      try {
        await broker.call('auth.getAccountById', { id: newAccount.id })
      } catch (error) {
        expect(error.message).toBe('Account not found')
      }
    })

    it('Shoud call auth.accounts.deleted event', () => {
      expect(onAuthAccountsDeletedMock).toBeCalled()
    })
  })

  afterAll(async () => {
    await Db.disconnect()
    await mongod.stop()
    await broker.stop()
  })
})
