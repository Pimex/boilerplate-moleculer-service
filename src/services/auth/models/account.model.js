const { Schema, model } = require('mongoose')

const schema = new Schema({
  roles: {
    type: [String],
    default: ['users']
  },
  active: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Object
  },
  type: {
    type: String,
    default: 'user'
  },
  sub: {
    type: String,
    required: true,
    unique: true
  }
},
{
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  },
  toObject: {
    transform: (doc, ret) => {
      delete ret.__v
      ret._id = ret._id.toString()
      ret.id = ret._id.toString()
    }
  }
})

module.exports = model('Account', schema, 'accounts')
