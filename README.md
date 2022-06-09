# dotvault 
![npm](https://img.shields.io/npm/v/dotvault?style=flat-square)
![NPM](https://img.shields.io/npm/l/dotvault)

Encrypt and decrypt .vault into a .env file  

## Installation

```bash
npm install --save-dev dotvault
yarn add --dev dotvault
```

And then you should be able to run the CLI with

```bash
npx dotvault --help
```

### Usage

```bash

dotvault CLI [Node: 16.15.0, CLI: 0.0.6]

Usage: dotvault <command>

Commands:
  dotvault init          Initializes project
  dotvault generate-key  Generate a new key vault
  dotvault encrypt       Encrypt vault section from env file to .vault
  dotvault decrypt       Decrypt .vault to vault section into env file

Options:
      --version  Show version number                                   [boolean]
  -h             Show help                                             [boolean]

Please specify a command
```

## Getting started 

### Initialization
`dotvault init`

.vault created  
.env updated  
Set your secrets into .env between  
```text
// BEGIN VAULT  
    SECRETS HERE  
// END VAULT  
```    

### Vault key
generate a key with `dotvault generate-key`  
put it in `DOTVAULT_KEY` or `-k option`  
share the key with your team in a secure way

### Encrypt secrets
encrypt .env secrets with `dotvault encrypt`  
You MUST commit the .vault for sharing secrets with your team

### Decrypt secrets
`dotvault decrypt` for updating your .env with .vault
