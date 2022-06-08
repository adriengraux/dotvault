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
    case 'encrypt':
      await encrypt(argv)
      break
  }
  process.exit(0)
}

function encrypt (argv) {
  helpers.checkIfInitialized()
  const vaultConfig = helpers.getVaultConfig()
  const keyVault = helpers.getKeyVault(argv.key)
  const encrypter = crypto.createCipheriv(configuration.cipher.algorithm, keyVault, vaultConfig.iv)
  const envFile = fs.readFileSync(vaultConfig.envFile, configuration.env.encoding)
  const { start, end } = vaultConfig.pattern
  const indexStart = envFile.indexOf(start)
  const indexEnd = envFile.indexOf(end)
  const vaultContentEnvFile = envFile.substring(indexStart, indexEnd + end.length)
  let encryptedMsg = encrypter.update(vaultContentEnvFile, configuration.env.encoding, configuration.vault.encoding)
  encryptedMsg += encrypter.final(configuration.vault.encoding)
  fs.writeFileSync(configuration.vault.file, encryptedMsg)
  console.info(`${configuration.vault.file} updated`)
}
