let inquirer = require('inquirer')
let prompt = inquirer.createPromptModule()
let cm = require('../../app/configuration-manager')
let SubCommand = require('./SubCommand')

const CREATE = 'create'
const DELETE = 'delete'
const SHOW_ONE = 'show-one'
const SHOW_ALL = 'show-all'

module.exports = class ConfigurationCommand extends SubCommand {
    static async getConnectionConfigurationProperty (message, name, defaultValue = null) {
        let inputNameInquirer = {
            type: 'input',
            message: message,
            name: name,
            default: defaultValue
        }

        let property = await prompt(inputNameInquirer)

        return property[name]
    }

    static async selectConfigurationAction () {
        let allConfigurationActionChoices = [
            {
                'name': 'create a new connection configuration',
                'value': CREATE
            },
            {
                'name': 'delete an existing connection configuration',
                'value': DELETE
            },
            {
                'name': 'show an existing connection configuration',
                'value': SHOW_ONE
            },
            {
                'name': 'show all existing connection configuration',
                'value': SHOW_ALL
            }
        ]

        let selectConfigurationActionInquirer = {
            type: 'list',
            message: 'Select an action',
            name: 'action',
            choices: allConfigurationActionChoices
        }

        let result = await prompt(selectConfigurationActionInquirer)

        return result.action
    }

    static async createAction () {
        let name = await ConfigurationCommand.getConnectionConfigurationProperty('Connection name', 'name')
        let description = await ConfigurationCommand.getConnectionConfigurationProperty('Description', 'description')
        let user = await ConfigurationCommand.getConnectionConfigurationProperty('User', 'user')
        let server = await ConfigurationCommand.getConnectionConfigurationProperty('Server', 'server')
        let port = await ConfigurationCommand.getConnectionConfigurationProperty('Port', 'port', 22)

        cm.addConnectionConfiguration(name, description, user, server, port)
    }

    static async deleteAction () {
        let cc = await ConfigurationCommand.selectConnectionConfiguration()
        cm.deleteConnectionConfiguration(cc.uuid)
    }

    static async showOneAction () {
        let cc = await ConfigurationCommand.selectConnectionConfiguration()
        cm.showConnectionConfiguration(cc.uuid)
    }

    static async showAllAction () {
        cm.showConnectionConfigurations()
    }

    static async run () {
        let action = await ConfigurationCommand.selectConfigurationAction()

        switch (action) {
        case CREATE:
            ConfigurationCommand.createAction()
            break
        case DELETE:
            ConfigurationCommand.deleteAction()
            break
        case SHOW_ONE:
            ConfigurationCommand.showOneAction()
            break
        case SHOW_ALL:
            ConfigurationCommand.showAllAction()
            break
        }
    }
}
