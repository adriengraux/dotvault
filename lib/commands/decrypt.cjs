const crypto = require('crypto')
const fs = require('fs')
const configuration = require('../configuration.cjs')
const helpers = require('../helpers.cjs')

exports.builder = (yargs) =>
  helpers.optionVaultFile(
    helpers.optionKeyVault(yargs)
  ).argv

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
  const commandVaultFile = argv[helpers.optionsArgs.vault]
  const commandKey = argv[helpers.optionsArgs.key]
  const vault = helpers.getVault(commandVaultFile)
  helpers.checkVaultData(vault)
  const keyVault = helpers.getKeyVault(commandKey, vault.envFile)
  const decrypter = crypto.createDecipheriv(configuration.cipher.algorithm, keyVault, vault.iv)
  let decryptedData = decrypter.update(vault.data, configuration.vault.dataEncoding, configuration.env.encoding)
  decryptedData += decrypter.final(configuration.env.encoding)
  const envOrigin = fs.readFileSync(vault.envFile, configuration.env.encoding)
  const { start, end } = vault.pattern
  const indexStart = envOrigin.indexOf(start)
  const indexEnd = envOrigin.indexOf(end)
  const beforeVault = envOrigin.substring(0, indexStart)
  const afterVault = envOrigin.substring(indexEnd + end.length, envOrigin.length)
  const result = beforeVault + decryptedData + afterVault
  fs.writeFileSync(vault.envFile, result)
  console.info(`${vault.envFile} updated with vault`)
}