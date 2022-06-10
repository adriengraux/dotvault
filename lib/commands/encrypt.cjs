const crypto = require('crypto')
const fs = require('fs')
const configuration = require('../configuration.cjs')
const helpers = require('../helpers.cjs')
const { success } = helpers.console

exports.builder = (yargs) =>
  helpers.optionVaultFile(
    helpers.optionKeyVault(yargs)
  ).argv

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
  const commandVaultFile = argv[helpers.optionsArgs.vault]
  const commandKey = argv[helpers.optionsArgs.key]

  const vault = helpers.getVault(commandVaultFile)
  const keyVault = helpers.getKeyVault(commandKey, vault.envFile)
  const { key, iv } = helpers.extractKeyIvFromKeyVault(keyVault)
  const encrypter = crypto.createCipheriv(configuration.cipher.algorithm, key, iv)
  const envFile = fs.readFileSync(vault.envFile, configuration.env.encoding)
  const { start, end } = vault.pattern
  const indexStart = envFile.indexOf(start)
  const indexEnd = envFile.indexOf(end)
  const vaultContentEnvFile = envFile.substring(indexStart, indexEnd + end.length)
  let encryptedMsg = encrypter.update(vaultContentEnvFile, configuration.env.encoding, configuration.vault.dataEncoding)
  encryptedMsg += encrypter.final(configuration.vault.dataEncoding)
  vault.data = encryptedMsg
  helpers.writeVault(commandVaultFile, vault)
  console.log(success(`${commandVaultFile} updated`))
}
