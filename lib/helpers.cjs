const fs = require('fs')
const configuration = require('./configuration.cjs')

module.exports = {
  checkIfInitialized: () => {
    if (!fs.existsSync(configuration.file)) {
      console.error('dotvault isn\'t initialized')
      process.exit(1)
    }
  },
  getVaultConfig: () => {
    return JSON.parse(fs.readFileSync(configuration.file))
  },
  getKeyVault: (keyFromCli) => {
    if (keyFromCli) {
      if (keyFromCli.length !== configuration.key.length) {
        console.error(`invalid key vault, length must be ${configuration.key.length}`)
        process.exit(1)
      }
      return keyFromCli
    } else {
      const key = process.env.DOTVAULT_KEY
      if (!key) {
        console.error('key vault is missing, set env var DOTVAULT_KEY or -k option')
        process.exit(1)
      }
      if (key.length !== configuration.key.length) {
        console.error(`invalid key vault, length must be ${configuration.key.length}`)
        process.exit(1)
      }
      return key
    }
  }
}
