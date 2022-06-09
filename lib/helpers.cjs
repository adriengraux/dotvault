const fs = require('fs')
const configuration = require('./configuration.cjs')
const Joi = require('joi')

module.exports = {

  checkIfIVaultExists: (vaultFile) => {
    if (!fs.existsSync(vaultFile)) {
      console.error(`${vaultFile} not exists, init first`)
      process.exit(1)
    }
  },
  getVault: (vaultFile) => {
    module.exports.checkIfIVaultExists(vaultFile)
    const vault = JSON.parse(fs.readFileSync(vaultFile))
    try {
      return Joi.attempt(vault, vaultSchema)
    } catch (e) {
      console.error(`attribute ${e.message} into ${vaultFile}`)
      console.error(`${vaultFile} compromised`)
      process.exit(1)
    }
  },
  checkVaultData: (vault) => {
    if (!vault.data || vault.data === configuration.vault.dataInit) {
      console.error('vault data is empty, encrypt first (dotvault encrypt)')
      process.exit(1)
    }
  },
  getKeyVault: (keyFromCli, envFile) => {
    if (keyFromCli) {
      if (keyFromCli.length !== configuration.key.length) {
        console.error(`invalid key vault, length must be ${configuration.key.length}`)
        console.error('fix or generate a key (dotvault generate-key)')
        process.exit(1)
      }
      return keyFromCli
    } else {
      require('dotenv').config({ path: envFile })
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
  writeVault: (vaultFile, vault) => {
    fs.writeFileSync(vaultFile, JSON.stringify(vault, null, 2))
  },
  optionsArgs: {
    vault: 'vault',
    key: 'key',
    env: 'env'
  },
  optionVaultFile: (yargs) => {
    return yargs.option(module.exports.optionsArgs.vault, {
      alias: 'v',
      describe: 'Override the default vault file',
      type: 'string',
      default: configuration.vault.defaultFile
    })
  },
  optionEnvFile: (yargs) => {
    return yargs.option(module.exports.optionsArgs.env, {
      alias: 'e',
      describe: 'Override the default env file',
      type: 'string',
      default: configuration.env.defaultFile
    })
  },
  optionKeyVault: (yargs) => {
    return yargs.option(module.exports.optionsArgs.key, {
      alias: 'k',
      describe: 'key vault, override DOTVAULT_KEY environment variable',
      type: 'string'
    })
  }
}

const vaultSchema = Joi.object({
  iv: Joi.string().length(configuration.iv.length).required(),
  envFile: Joi.string().required(),
  data: Joi.string().allow(configuration.vault.dataInit).required(),
  pattern: Joi.object({
    begin: Joi.string().required(),
    end: Joi.string().required()
  })
})
