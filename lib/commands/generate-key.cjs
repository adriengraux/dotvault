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
  const crypto = require('crypto')
  return new Promise((resolve, reject) => {
    crypto.generateKey('aes', { length: 256 }, (err, key) => {
      if (err) {
        return reject(err)
      }
      resolve(key)
    })
  })
}

async function generateKey () {
  const key = await generateKeyAes()
  console.log(key.export().toString('hex').slice(0, 32))
}
