const configuration = require('../configuration.cjs')()

exports.builder = (yargs) =>
  yargs.option('file', {
    alias: 'f',
    describe: 'Override the default env file',
    type: 'string',
    default: '.env'
  }).argv

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
  const crypto = require('crypto')
  const fs = require('fs')

  if (fs.existsSync('config.vault')) {
    console.error('already initialized')
    process.exit(1)
  }

  const iv = crypto.randomBytes(16).toString('hex').slice(0, 16)
  const configVault = {
    iv,
    envFile: argv.file,
    pattern: configuration.pattern
  }
  fs.writeFileSync('config.vault', JSON.stringify(configVault, null, 2))
  fs.writeFileSync('.vault', '')
  const vaultPattern = `${configuration.pattern.begin}\n${configuration.pattern.end}`

  if (fs.existsSync(argv.file)) {
    fs.appendFileSync(argv.file, vaultPattern)
    console.info(`${argv.file} updated`)
  } else {
    fs.writeFileSync(argv.file, vaultPattern)
    console.info(`${argv.file} created`)
  }
}
