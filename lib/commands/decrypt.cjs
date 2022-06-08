const crypto = require('crypto')
const fs = require('fs')
const configuration = require('../configuration.cjs')
const helpers = require('../helpers.cjs')

exports.builder = (yargs) =>
  yargs.option('key', {
    alias: 'k',
    describe: 'key vault, override DOTVAULT_KEY',
    type: 'string'
  }).argv

exports.handler = async function (argv) {
  const command = argv._[0]

  switch (command) {
    case 'decrypt':
      await decrypt(argv)
      break
  }
  process.exit(0)
}

function decrypt (argv) {
  helpers.checkIfInitialized()
  const vaultConfig = helpers.getVaultConfig()
  const keyVault = helpers.getKeyVault(argv.key)
  const encryptedData = fs.readFileSync(configuration.vault.file, configuration.env.encoding)
  const decrypter = crypto.createDecipheriv(configuration.cipher.algorithm, keyVault, vaultConfig.iv)
  let decryptedData = decrypter.update(encryptedData, configuration.vault.encoding, configuration.env.encoding)
  decryptedData += decrypter.final(configuration.env.encoding)
  const envOrigin = fs.readFileSync(vaultConfig.envFile, configuration.env.encoding)
  const { start, end } = vaultConfig.pattern
  const indexStart = envOrigin.indexOf(start)
  const indexEnd = envOrigin.indexOf(end)
  const avantVault = envOrigin.substring(0, indexStart)
  const apresVault = envOrigin.substring(indexEnd + end.length, envOrigin.length)
  const total = avantVault + decryptedData + apresVault
  fs.writeFileSync(vaultConfig.envFile, total)
  console.info(`${vaultConfig.envFile} updated with vault`)
}
