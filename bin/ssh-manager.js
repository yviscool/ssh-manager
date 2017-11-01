#!/usr/bin/env node

let program = require('commander')
let inquirer = require('inquirer')
let prompt = inquirer.createPromptModule()
let colors = require('../lib/colors-custom')
let configurationManager = require('../lib/ConfigurationManager.js')
let SSHConnection = require('../lib/SSHConnection')
let ConnectionConfiguration = require('../lib/ConnectionConfiguration')

async function getConnectionConfigurationProperty (message, name) {
    let inputNameInquirer = {
        type: 'input',
        message: message,
        name: name
    }

    let property = await prompt(inputNameInquirer)

    return property[name]
}

async function selectConnectionConfiguration () {
    let allConnectionConfigurationChoices = configurationManager.getConnectionConfigurationList()

    if (allConnectionConfigurationChoices.length === 0) {
        console.log(colors.error(new Error('no connection configuration found into "' + configurationManager.getConnectionConfigurationFilePath() + '". Please use "add" command.')))
        exit(1)
    }

    let selectConnectionConfigurationInquirer = {
        type: 'list',
        message: 'Select an connection',
        name: 'uuid',
        choices: allConnectionConfigurationChoices
    }

    let result = await prompt(selectConnectionConfigurationInquirer)
    let selectedConnectionConfiguration = null

    try {
        selectedConnectionConfiguration = configurationManager.getConnectionConfiguration(result.uuid)
    } catch (e) {
        exit(1)
    }

    return selectedConnectionConfiguration
}

function exit (code) {
    process.exit(code)
}

program
    .version('1.0.0')
    .description('A SSH manager to store a list of SSH connection configuration')

program
    .command('show')
    .description('show all projects SSH configurations')
    .action(() => {
        configurationManager.showConnectionConfigurations()
    })

program
    .command('delete')
    .description('delete an SSH connection configuration')
    .action(async () => {
        let projectConfiguration = await selectConnectionConfiguration()
        configurationManager.deleteConnectionConfiguration(projectConfiguration.uuid)
    })

program
    .command('add')
    .description('add a new SSH connection configuration')
    .action(async () => {
        let name = await getConnectionConfigurationProperty('Connection name', 'name')
        let description = await getConnectionConfigurationProperty('Description', 'description')
        let user = await getConnectionConfigurationProperty('User', 'user')
        let server = await getConnectionConfigurationProperty('Server', 'server')

        configurationManager.addConnectionConfiguration(name, description, user, server)
    })

program
    .command('connect')
    .description('start an SSH connection')
    .action(async () => {
        let projectConfiguration = await selectConnectionConfiguration()
        let cc = new ConnectionConfiguration(projectConfiguration)
        SSHConnection.init(cc)
        SSHConnection.start(exit)
    })

program.parse(process.argv)
