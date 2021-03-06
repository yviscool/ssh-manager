#!/usr/bin/env node

const program = require('commander')
const colors = require('../app/colors-custom')
const ConfigurationCommand = require('../lib/command/ConfigurationCommand')
const ConnectionCommand = require('../lib/command/ConnectionCommand')
const version = require('../package').version

process.stdin.on('data', exitOnSIGINT)

program
    .version(version)
    .description('A SSH manager to store a list of SSH connection configuration')

program
    .command('connect')
    .description('start an SSH connection')
    .action(ConnectionCommand.run)

program
    .command('config')
    .description('configure SSH connections')
    .action(ConfigurationCommand.run)

program
    .command('*')
    .action(() => {
        console.log(colors.error('unknown command : please use "--help" option to show available commands'))
        process.exit(1)
    })

program.parse(process.argv)

// launch connect command if no argument given
if (program.args.length === 0) {
    ConnectionCommand.run()
}

function exitOnSIGINT (key) {
    if (key.toString() === '\u0003') {
        process.exit(1)
    }
}
