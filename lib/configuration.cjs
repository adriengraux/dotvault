module.exports = {
  env: {
    defaultFile: '.env',
    encoding: 'utf8'
  },
  cipher: {
    algorithm: 'aes-256-cbc'
  },
  iv: {
    length: 16,
    encoding: 'hex'
  },
  key: {
    type: 'aes',
    encoding: 'hex',
    length: 32,
    options: {
      length: 256
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
