#! /usr/bin/env node
require('dotenv').config()
const yargs = require('yargs')
const init = require('./commands/init.cjs')

// eslint-disable-next-line no-unused-vars
const argv = yargs
  .usage('Usage: dotvault <command>')
  .version()
  .command('init', 'Initializes project', init)
  .help('h')
  .demandCommand(1, 'Please specify a command')
  .strict()
  .argv
