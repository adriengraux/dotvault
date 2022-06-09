const fs = require('fs')
const configuration = require('./configuration.cjs')
const Joi = require('joi')

module.exports = {

  checkIfIVaultExists: () => {
    if (!fs.existsSync(configuration.vault.file)) {
      console.error(`${configuration.vault.file} not exists, init first`)
      process.exit(1)
    }
  },
  getVault: () => {
    module.exports.checkIfIVaultExists()
    const vault = JSON.parse(fs.readFileSync(configuration.vault.file))
    try {
      return Joi.attempt(vault, vaultSchema)
    } catch (e) {
      console.error(`attribute ${e.message} into ${configuration.vault.file}`)
      console.error(`${configuration.vault.file} compromised`)
      process.exit(1)
    }
  },
  checkVaultData: (vault) => {
    if (!vault.data || vault.data === configuration.vault.dataInit) {
      console.error(`${configuration.vault.file}.data is missing or empty, encrypt first (dotvault encrypt)`)
      process.exit(1)
    }
  },
  getKeyVault: (keyFromCli) => {
    if (keyFromCli) {
      if (keyFromCli.length !== configuration.key.length) {
        console.error(`invalid key vault, length must be ${configuration.key.length}`)
        console.error('fix or generate a key (dotvault generate-key)')
        process.exit(1)
      }
      return keyFromCli
    } else {
      const key = process.env.DOTVAULT_KEY
      if (!key) {
        console.error('key vault is missing, set env var DOTVAULT_KEY or -k option')
        console.error('fix or generate a key (dotvault generate-key)')
        process.exit(1)
      }
      if (key.length !== configuration.key.length) {
        console.error(`invalid key vault, length must be ${configuration.key.length}`)
        process.exit(1)
      }
      return key
    }
  },
  writeVault: (vault) => {
    fs.writeFileSync(configuration.vault.file, JSON.stringify(vault, null, 2))
  }
}

const vaultSchema = Joi.object({
  iv: Joi.string().length(configuration.iv.length).required(),
  envFile: Joi.string().required(),
  data: Joi.string().required(),
  pattern: Joi.object({
    begin: Joi.string().required(),
    end: Joi.string().required()
  })
})
