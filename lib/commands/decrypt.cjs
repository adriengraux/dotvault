const crypto = require('crypto')
const fs = require('fs')
const configuration = require('../configuration.cjs')
const helpers = require('../helpers.cjs')
const { success } = helpers.console

exports.builder = (yargs) =>
  helpers.optionVaultFile(
    helpers.optionKeyVault(yargs
      .option('output', {
        alias: 'o',
        describe: 'decrypt into specified file instead of vault env file',
        type: 'string'
      }))
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
  const { output } = argv
  const commandVaultFile = argv[helpers.optionsArgs.vault]
  const commandKey = argv[helpers.optionsArgs.key]
  const vault = helpers.getVault(commandVaultFile)
  helpers.checkVaultData(vault)
  const keyVault = helpers.getKeyVault(commandKey, vault.envFile)
  const { key, iv } = helpers.extractKeyIvFromKeyVault(keyVault)
  const decrypter = crypto.createDecipheriv(configuration.cipher.algorithm, key, iv)
  let decryptedData = decrypter.update(vault.data, configuration.vault.dataEncoding, configuration.env.encoding)
  decryptedData += decrypter.final(configuration.env.encoding)

  if (!output) {
    const envOrigin = fs.readFileSync(vault.envFile, configuration.env.encoding)
    const { begin, end } = vault.pattern
    const indexBegin = envOrigin.indexOf(begin)
    const indexEnd = envOrigin.indexOf(end)
    const beforeVault = envOrigin.substring(0, indexBegin + begin.length)
    const afterVault = envOrigin.substring(indexEnd, envOrigin.length)
    const result = beforeVault + decryptedData + afterVault
    fs.writeFileSync(vault.envFile, result)
    console.log(success(`${vault.envFile} updated with vault`))
  } else {
    fs.writeFileSync(output, decryptedData)
    console.log(success(`${output} updated with vault`))
  }
}
