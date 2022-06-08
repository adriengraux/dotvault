#! /usr/bin/env node
require("dotenv").config()
const init = require('./commands/init.cjs')

const yargs = require("yargs")

const args = yargs
  .usage("Usage: dotvault <command>")
  .version()
  .command('init', 'Initializes project', init)
  .help("h")
  .demandCommand(1, 'Please specify a command')
  .strict()
  .argv

