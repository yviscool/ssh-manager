#!/usr/bin/env node

let program = require('commander')
let inquirer = require('inquirer')
let prompt = inquirer.createPromptModule()
let colors = require('../app/colors-custom')
let cm = require('../app/configuration-manager')
let SSHConnection = require('../lib/SSHConnection')
let ConnectionConfiguration = require('../lib/ConnectionConfiguration')

async function getConnectionConfigurationProperty (message, name, defaultValue = null) {
    let inputNameInquirer = {
        type: 'input',
        message: message,
        name: name,
        default: defaultValue
    }

    let property = await prompt(inputNameInquirer)

    return property[name]
}

async function selectConnectionConfiguration () {
    let allConnectionConfigurationChoices = cm.getConnectionConfigurationList()

    if (allConnectionConfigurationChoices.length === 0) {
        console.log(colors.error(new Error('no connection configuration found into "' + cm.ccfp + '". Please use "add" command.')))
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
        selectedConnectionConfiguration = cm.getConnectionConfiguration(result.uuid)
    } catch (e) {
        exit(1)
    }

    return selectedConnectionConfiguration
}

function exit (code) {
    process.exit(code)
}

async function connectAction () {
    let projectConfiguration = await selectConnectionConfiguration()
    let cc = new ConnectionConfiguration(projectConfiguration)
    let sc = new SSHConnection(cc)
    sc.start(exit)
}

async function addAction () {
    let name = await getConnectionConfigurationProperty('Connection name', 'name')
    let description = await getConnectionConfigurationProperty('Description', 'description')
    let user = await getConnectionConfigurationProperty('User', 'user')
    let server = await getConnectionConfigurationProperty('Server', 'server')
    let port = await getConnectionConfigurationProperty('Port', 'port', 22)

    cm.addConnectionConfiguration(name, description, user, server, port)
}

async function deleteAction () {
    let projectConfiguration = await selectConnectionConfiguration()
    cm.deleteConnectionConfiguration(projectConfiguration.uuid)
}

program
    .version('1.0.0')
    .description('A SSH manager to store a list of SSH connection configuration')

program
    .command('show')
    .description('show all projects SSH configurations')
    .action(() => {
        cm.showConnectionConfigurations()
    })

program
    .command('delete')
    .description('delete an SSH connection configuration')
    .action(deleteAction)

program
    .command('add')
    .description('add a new SSH connection configuration')
    .action(addAction)

program
    .command('connect')
    .description('start an SSH connection')
    .action(connectAction)

program.parse(process.argv)

// launch connect command if no argument given
if (program.args.length === 0) {
    connectAction()
}
