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

const generateKeyAes = () => {
  return new Promise((resolve, reject) => {
    crypto.generateKey(configuration.key.type, configuration.key.options, (err, key) => {
      if (err) {
        return reject(err)
      }
      resolve(key)
    })
  })
}

async function generateKey () {
  const key = await generateKeyAes()
  const keyVault = key.export().toString(configuration.key.encoding).slice(0, configuration.key.length)
  console.log(warning(keyVault))
}
