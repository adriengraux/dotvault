const fs = require('fs')
const configuration = require('./configuration.cjs')
const Joi = require('joi')

module.exports = {
  checkIfInitialized: () => {
    if (!fs.existsSync(configuration.file)) {
      console.error('dotvault isn\'t initialized')
      process.exit(1)
    }
  },
  checkIfIVaultExists: () => {
    if (!fs.existsSync(configuration.vault.file)) {
      console.error(`${configuration.vault.file} not exists, encrypt first`)
      process.exit(1)
    }
  },
  getVaultConfig: () => {
    const vaultConfig = JSON.parse(fs.readFileSync(configuration.file))
    try {
      return Joi.attempt(vaultConfig, vaultConfigSchema)
    } catch (e) {
      console.error(`attribute ${e.message} into ${configuration.file}`)
      console.error(`${configuration.file} compromised`)
      process.exit(1)
    }
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

const vaultConfigSchema = Joi.object({
  iv: Joi.string().length(configuration.iv.length).required(),
  envFile: Joi.string().required(),
  pattern: Joi.object({
    begin: Joi.string().required(),
    end: Joi.string().required()
  })
})
