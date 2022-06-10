const crypto = require('crypto')
const configuration = require('../configuration.cjs')
const helpers = require('../helpers.cjs')
const { warning } = helpers.console

exports.builder = () => {
}

exports.handler = async function (argv) {
  const command = argv._[0]

  switch (command) {
    case 'generate-key':
      await generateKey()
      break
  }
  process.exit(0)
}

async function generateKey () {
  const password = crypto.randomBytes(configuration.key.entropy.password)
  const salt = crypto.randomBytes(configuration.key.entropy.salt)
  const keyVault = crypto.pbkdf2Sync(password, salt, configuration.key.iterations, configuration.key.lengthBytes, configuration.key.digest)
    .toString(configuration.key.encoding)
  console.log(warning(keyVault))
}
