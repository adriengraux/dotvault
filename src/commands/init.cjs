#! /usr/bin/env node

exports.builder = (yargs) =>
  yargs.option('force', {
    describe: 'Will drop the existing config folder and re-create it',
    type: 'boolean',
    default: false,
  }).argv;

exports.handler = async function (argv) {
  const command = argv._[0];

  switch (command) {
    case 'init':
      console.log("init called")
      break;

    
  }

  process.exit(0);
};
