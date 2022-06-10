const fs = require('fs')
const configuration = require('./configuration.cjs')
const Joi = require('joi')
const clc = require('cli-color')
const path = require('path')
const packageJson = require(path.resolve(
  __dirname,
  '..',
  'package.json'
))

const consoleStyle = {
  error: clc.red.bold,
  success: clc.green,
  warning: clc.yellow,
  notice: clc.blue,
  heading: clc.bgCyan.underline
}

const { error, notice } = consoleStyle

module.exports = {

  checkIfIVaultExists: (vaultFile) => {
    if (!fs.existsSync(vaultFile)) {
      console.log(`${vaultFile} not exists, init first`)
      process.exit(1)
    }
  },
  getVault: (vaultFile) => {
    module.exports.checkIfIVaultExists(vaultFile)
    const vault = JSON.parse(fs.readFileSync(vaultFile))
    try {
      return Joi.attempt(vault, vaultSchema)
    } catch (e) {
      console.log(error(`attribute ${e.message} into ${vaultFile}`))
      console.log(error(`${vaultFile} compromised`))
      process.exit(1)
    }
  },
  checkVaultData: (vault) => {
    if (!vault.data || vault.data === configuration.vault.dataInit) {
      console.log(error('vault data is empty, encrypt first (dotvault encrypt)'))
      process.exit(1)
    }
  },
  getKeyVault: (keyFromCli, envFile) => {
    if (keyFromCli) {
      if (keyFromCli.length !== configuration.key.length) {
        console.log(error(`invalid key vault, length must be ${configuration.key.length}`))
        console.log(notice('fix or generate a key (dotvault generate-key)'))
        process.exit(1)
      }
      return keyFromCli
    } else {
      require('dotenv').config({ path: envFile })
      const key = process.env.DOTVAULT_KEY
      if (!key) {
        console.log(error('key vault is missing, set env var DOTVAULT_KEY or -k option'))
        console.log(notice('fix or generate a key (dotvault generate-key)'))
        process.exit(1)
      }
      if (key.length !== configuration.key.length) {
        console.log(error(`invalid key vault, length must be ${configuration.key.length}`))
        process.exit(1)
      }
      return key
    }
  },
  extractKeyIvFromKeyVault: (keyVault) => {
    return {
      key: keyVault.slice(0, 32),
      iv: keyVault.slice(32, 48)
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
  },
  getNodeVersion: () => {
    return process.version.replace('v', '')
  },
  getCliVersion () {
    return packageJson.version
  },
  console: consoleStyle
}

const vaultSchema = Joi.object({
  envFile: Joi.string().required(),
  data: Joi.string().allow(configuration.vault.dataInit).required(),
  pattern: Joi.object({
    begin: Joi.string().required(),
    end: Joi.string().required()
  })
})
