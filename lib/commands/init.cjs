const configuration = require('../configuration.cjs')
const helpers = require('../helpers.cjs')
const fs = require('fs')
const { error, notice, success, warning } = helpers.console

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
    console.log(error('vault already exists'))
    console.log(notice('specify vault whit -v option or force init with -f option'))
    process.exit(1)
  }

  if (commandForce) {
    fs.rmSync(configuration.vault.defaultFile, { force: true })
  }

  const { key, begin, end, extra } = configuration.pattern
  const vault = {
    envFile: commandEnvFile,
    pattern: { begin, end },
    data: configuration.vault.dataInit
  }
  helpers.writeVault(commandVaultFile, vault)
  console.log(success(`${commandVaultFile} created`))

  const vaultPattern = `${key}\n${begin}\n${end}\n${extra}`
  if (fs.existsSync(commandEnvFile)) {
    fs.appendFileSync(commandEnvFile, vaultPattern)
    console.log(success(`${commandEnvFile} updated`))
  } else {
    fs.writeFileSync(commandEnvFile, vaultPattern)
    console.info(success(`${commandEnvFile} created`))
  }

  console.log(notice(`Set your secrets in ${vault.envFile} into \n \t${vault.pattern.begin}\n\t\tSECRETS HERE\n\t${vault.pattern.end}\n--> then encrypt with dotvault encrypt`))
  console.log(warning(`You MUST commit the ${commandVaultFile} for sharing secrets with your team`))
}
