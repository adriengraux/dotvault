module.exports = () => ({
  cipher: {
    algorithm: 'aes-256-cbc'
  },
  textEncoding: 'utf8',
  vault: { encoding: 'hex', file: '.vault' },
  pattern: {
    key: 'DOTVAULT_KEY=PLACE YOUR KEY HERE',
    begin: '// BEGIN VAULT',
    end: '// END VAULT',
    extra: '###--------------------------------------------------------------------------------###\n' +
      '###------------------------------- CUSTOM ENV VARS --------------------------------###\n' +
      '###--------------------------------------------------------------------------------###'
  }
})
