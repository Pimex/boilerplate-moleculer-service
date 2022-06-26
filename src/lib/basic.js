'use strict'

const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

/**
 * [Basic Class]
 * @description The instans from this Class return all methods from Basic
 * Manage all Basic methos, this require Mongo Model pre defined and one Mongo connection success
 * @param {String} id - Basic mongo id, this field response with mongoId
 * @retun Basic Object intance
*/

class Basic {
  constructor ({ name, query = null, model = null } = {}) {
    if (model) {
      this.model = model
    }

    if (!this.model) throw Boom.badRequest('Model is require')

    this.query = query
    this.name = name
  }

  /**
   * @description [Add new Basic]
   * @param {Object} data - Object data with new Basic data
   */

  static async add (data = null) {
    try {
      if (Joi.object().required().empty({}).validate(data).error) {
        throw Boom.badRequest(`Data ${this.name} is invalid`)
      }

      const basic = await this.model.create(data)

      return basic.toObject()
    } catch (error) {
      if (error.message.includes('validation')) {
        throw Boom.badRequest(error.message)
      }

      if (error.message.includes('duplicate')) {
        throw Boom.conflict(error.message)
      }

      throw Boom.boomify(error)
    }
  }

  async get ({ required = false, object = true, select = false } = {}) {
    try {
      const req = this.model.findOne(this.query)

      if (select) req.select(select)

      const basicData = await req.exec()

      if (basicData) this._id = basicData._id

      if (required && !basicData) throw Boom.notFound(`${this.name} not found`)

      if (!basicData) return null

      if (object) return basicData.toObject()

      return basicData
    } catch (error) {
      throw Boom.boomify(error)
    }
  }

  /**
   * [Get all basics in db]
   * @param {Object} query - Query filter Object acepted for Mongoose find() method
   */

  static async count () {
    try {
      const count = await this.model.estimatedDocumentCount()
      return count
    } catch (error) {
      throw Boom.boomify(error)
    }
  }

  static async countQuery ({ query = {} } = {}) {
    try {
      const count = await this.model.countDocuments(query)
      return count
    } catch (error) {
      throw Boom.boomify(error)
    }
  }

  static async getAll ({ query = {}, params = {}, joins = [], select = false } = {}) {
    try {
      // Validate query param type Object
      if (Joi.object().validate(query).error) throw Boom.badRequest('Parameter "query" must be an object')

      const { orderBy = 'created', order = 'desc', limit, page = 1 } = params
      let { skip = 0 } = params

      const req = this.model.find(query)

      const orderObject = {}
      orderObject[orderBy] = order === 'asc' ? 1 : -1

      req.sort(orderObject)

      if (joins.length) {
        joins.forEach(field => {
          req.populate(field)
        })
      }

      if (limit) {
        if (page > 1) skip = limit * (page - 1)
        req.limit(parseInt(limit)).skip(parseInt(skip))
      }

      if (select) req.select(select)

      return await req.exec()
    } catch (error) {
      throw Boom.boomify(error)
    }
  }

  async delete ({ required = true } = {}) {
    try {
      const itemData = await this.get({ required })
      return this.model.deleteOne({ _id: itemData.id })
    } catch (error) {
      throw Boom.boomify(error)
    }
  }

  /**
   * [Update an basic]
   * @param {Object} data - Object with new data for basic
   */

  async update (data = null, params = {}) {
    try {
      if (Joi.object().required().empty({}).validate(data).error) {
        throw Boom.badRequest(`Error, ${this.name} data not found or invalid`)
      }

      const storeData = await this.get()

      if (!storeData) return this.model.create(data)

      const result = await this.model.updateOne({ _id: storeData.id }, data, params)

      return { ...result, _id: storeData._id, id: storeData.id }
    } catch (error) {
      if (error.message.includes('Cast')) {
        throw Boom.badRequest(error)
      }
      throw Boom.boomify(error)
    }
  }

  /**
   * [Update many object with query]
   * @param {Object} query- Object with filter query
   * @param {Object} update- Object with update
   * @param {Object} multi- Object with boolean multi
   */

  static async updateAll (query = {}, update = {}, multi = {}) {
    try {
      // Validate query param type Object
      if (Joi.object().validate(query).error) throw Boom.badRequest('Parameter "query" must be an object')

      const req = this.model.updateMany(query, update, multi)

      const basics = await req.exec()
      return basics
    } catch (error) {
      throw Boom.boomify(error)
    }
  }
}

module.exports = Basic
