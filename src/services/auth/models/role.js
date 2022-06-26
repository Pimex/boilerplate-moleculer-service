'use strict'

const { Schema, model } = require('mongoose')

const schema = new Schema({
  name: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    unique: true
  },
  scopes: {
    type: [String],
    required: true,
    validate: function () {
      if (!this.scopes.length) return false
      return true
    }
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v
      ret._id = ret._id.toString()
    }
  }
})

module.exports = model('Role', schema, 'roles')
