'use strict'

const { Types } = require('mongoose')
const Basic = require('../../../../lib/basic')
const Model = require('../../models/role')
const { badRequest } = require('@hapi/boom')

class Role extends Basic {
  constructor (id) {
    const _id = /^[0-9a-fA-F]{24}$/.test(id) ? Types.ObjectId(id) : null
    const slug = !_id ? id : null

    const $or = []

    if (_id) $or.push({ _id: id })
    if (slug) $or.push({ slug })

    if (!$or.length) throw badRequest(`Invalid Role Id ${id}`)

    super({
      name: 'Role',
      query: {
        $or
      },
      model: Model
    })

    this._id = _id
  }
}

Role.model = Model

module.exports = Role
