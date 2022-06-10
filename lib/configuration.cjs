module.exports = {
  env: {
    defaultFile: '.env',
    encoding: 'utf8'
  },
  cipher: {
    algorithm: 'aes-256-cbc'
  },
  key: {
    encoding: 'hex',
    length: 48,
    lengthBytes: 24,
    iterations: 100000,
    digest: 'sha512',
    entropy: {
      password: 32,
      salt: 32
    }
  },
  vault: {
    dataEncoding: 'hex',
    defaultFile: '.vault',
    dataInit: ''
  },
  pattern: {
    key: 'DOTVAULT_KEY=',
    begin: '// BEGIN VAULT',
    end: '// END VAULT',
    extra: '###--------------------------------------------------------------------------------###\n' +
      '###------------------------------- CUSTOM ENV VARS --------------------------------###\n' +
      '###--------------------------------------------------------------------------------###'
  }
}
