const mongoose = require('mongoose')

/**
 * Class representing a MongooseConnection
 * @extends Connection
 */

class MongooseConnection {
  constructor () {
    this.Types = mongoose.Types
    this.Schema = mongoose.Schema
    this.connection = null
    this.isConnected = false
    this.db = mongoose
  }

  /**
   * Load mongo model
   * @param {string} name - Model name
   * @param {Schema} schema - schema instance from new Schema()
   * @param {string} collectionName - collectionName
   * @return {Model} Mongoose model
   */
  loadModel ({ name, schema, collectionName } = {}) {
    return this.db.model(name, schema, collectionName)
  }

  /**
   * Connect to mongo
   * @param {string} uri - uri
   * @param {boolean} debug - debug
   * @param {object} options - options
   */
  async connect ({ uri, debug = false, options = {} }) {
    if (this.isConnected) return this.connection

    const connectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...options
    }

    const connection = await this.db.connect(uri, connectOptions)

    if (debug) this.db.set('debug', debug)

    this.isConnected = true
    this.connection = connection

    return connection
  }

  /** Disconnect from mongoose */
  async disconnect () {
    await this.db.connection.close()
    this.connection = null
    this.isConnected = false
    return true
  }

  /**
   * Get mongo connection status
   * @return {number} mongo connection status
   */
  getStatus () {
    return this.db.STATES[this.db.connection.readyState]
  }

  /**
   * Check if connection is ready
   * @return {boolean}
   */
  isConnected () {
    return this.db.connection.readyState === 1
  }
}

module.exports = new MongooseConnection()
