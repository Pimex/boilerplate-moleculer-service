const actions = require('./actions/auth.action')
const methods = require('./methods/auth.method')

module.exports = {
  name: 'auth',
  actions,
  methods,
  events: {}
}
