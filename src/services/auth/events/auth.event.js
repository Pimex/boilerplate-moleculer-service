module.exports = {
  'auth.roles.removed': {
    async handler ({ id, slug }) {
      try {
        this.logger.info('Updated account in event auth.roles.removed')
      } catch (error) {
        this.logger.error(`Error in event 'auth.roles.removed': ${error}`)
      }
    }
  }
}
