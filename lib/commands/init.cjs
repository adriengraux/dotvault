const configuration = require('../configuration.cjs')
const helpers = require('../helpers.cjs')
const crypto = require('crypto')
const fs = require('fs')

exports.builder = (yargs) =>
  helpers.optionVaultFile(
    helpers.optionEnvFile(yargs
      .option('force', {
        alias: 'f',
        describe: 'Override vault if exists',
        type: 'boolean',
        default: false
      })
    )
  ).argv

exports.handler = async function (argv) {
  const command = argv._[0]

  switch (command) {
    case 'init':
      init(argv)
      break
  }

  process.exit(0)
}

function init (argv) {
  const commandForce = argv.force
  const commandEnvFile = argv[helpers.optionsArgs.env]
  const commandVaultFile = argv[helpers.optionsArgs.vault]
  if (fs.existsSync(commandVaultFile) && !commandForce) {
    console.error('vault already exists')
    process.exit(1)
  }

  if (commandForce) {
    fs.rmSync(configuration.vault.defaultFile, { force: true })
  }

  const iv = crypto.randomBytes(configuration.iv.length).toString(configuration.iv.encoding).slice(0, configuration.iv.length)
  const { key, begin, end, extra } = configuration.pattern
  const vault = {
    iv,
    envFile: commandEnvFile,
    pattern: { begin, end },
    data: configuration.vault.dataInit
  }
  helpers.writeVault(commandVaultFile, vault)
  console.info(`${commandVaultFile} created`)

  const vaultPattern = `${key}\n${begin}\n${end}\n${extra}`
  if (fs.existsSync(commandEnvFile)) {
    fs.appendFileSync(commandEnvFile, vaultPattern)
    console.info(`${commandEnvFile} updated`)
  } else {
    fs.writeFileSync(commandEnvFile, vaultPattern)
    console.info(`${commandEnvFile} created`)
  }
}
