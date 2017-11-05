#!/usr/bin/env node

let program = require('commander')
let colors = require('../app/colors-custom')
let ConfigurationCommand = require('../lib/command/ConfigurationCommand')
let ConnectionCommand = require('../lib/command/ConnectionCommand')

program
    .version('1.0.0')
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
