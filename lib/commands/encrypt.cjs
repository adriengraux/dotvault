const crypto = require('crypto')
const fs = require('fs')
const configuration = require('../configuration.cjs')()

exports.builder = (yargs) =>
  yargs.option('key', {
    alias: 'k',
    describe: 'key vault, override DOTVAULT_KEY',
    type: 'string'
  }).argv

exports.handler = async function (argv) {
  const command = argv._[0]

  switch (command) {
    case 'encrypt':
      await encrypt(argv)
      break
  }
  process.exit(0)
}

function checkIfInitialized () {
  if (!fs.existsSync('config.vault')) {
    console.error('dotvault isn\'t initialized')
    process.exit(1)
  }
}

function getVaultConfig () {
  return JSON.parse(fs.readFileSync('config.vault'))
}

function getKeyVault (keyFromCli) {
  if (keyFromCli) {
    return keyFromCli
  } else {
    const key = process.env.DOTVAULT_KEY
    if (!key) {
      console.error('key vault is missing, set env var DOTVAULT_KEY or -k option')
      process.exit(1)
    }
    return key
  }
}

function encrypt (argv) {
  checkIfInitialized()
  const vaultConfig = getVaultConfig()
  const keyVault = getKeyVault(argv.key)
  const encrypter = crypto.createCipheriv(configuration.cipher.algorithm, keyVault, vaultConfig.iv)
  const envFile = fs.readFileSync(vaultConfig.envFile, configuration.textEncoding)
  const { start, end } = vaultConfig.pattern
  const indexStart = envFile.indexOf(start)
  const indexEnd = envFile.indexOf(end)
  const vaultContentEnvFile = envFile.substring(indexStart, indexEnd + end.length)
  let encryptedMsg = encrypter.update(vaultContentEnvFile, configuration.textEncoding, configuration.vault.encoding)
  encryptedMsg += encrypter.final(configuration.vault.encoding)
  fs.writeFileSync(configuration.vault.file, encryptedMsg)
  console.info(`${configuration.vault.file} updated with success`)
}
