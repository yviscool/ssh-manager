let inquirer = require('inquirer')
let prompt = inquirer.createPromptModule()
let cm = require('../../app/configuration-manager')
let SubCommand = require('./SubCommand')

const CREATE = 'create'
const EDIT = 'edit'
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
                'name': 'edit an existing connection configuration',
                'value': EDIT
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
        let name = await ConfigurationCommand.getConnectionConfigurationProperty('Connection name', 'name', 'custom connection')
        let description = await ConfigurationCommand.getConnectionConfigurationProperty('Description', 'description', 'my custom connection')
        let user = await ConfigurationCommand.getConnectionConfigurationProperty('User', 'user', 'root')
        let server = await ConfigurationCommand.getConnectionConfigurationProperty('Server', 'server', '192.168.1.1')
        let port = await ConfigurationCommand.getConnectionConfigurationProperty('Port', 'port', 22)
        let path = await ConfigurationCommand.getConnectionConfigurationProperty('Path', 'path', '~')

        cm.addConnectionConfiguration(name, description, user, server, port, path)
    }

    static async editAction () {
        let cc = await ConfigurationCommand.selectConnectionConfiguration()
        let name = await ConfigurationCommand.getConnectionConfigurationProperty('Connection name', 'name', ('name' in cc && typeof cc.name !== 'undefined') ? cc.name : null)
        let description = await ConfigurationCommand.getConnectionConfigurationProperty('Description', 'description', ('description' in cc && typeof cc.description !== 'undefined') ? cc.description : null)
        let user = await ConfigurationCommand.getConnectionConfigurationProperty('User', 'user', ('user' in cc && typeof cc.user !== 'undefined') ? cc.user : null)
        let server = await ConfigurationCommand.getConnectionConfigurationProperty('Server', 'server', ('server' in cc && typeof cc.server !== 'undefined') ? cc.server : null)
        let port = await ConfigurationCommand.getConnectionConfigurationProperty('Port', 'port', ('port' in cc && typeof cc.port !== 'undefined') ? cc.port : null)
        let path = await ConfigurationCommand.getConnectionConfigurationProperty('Path', 'path', ('path' in cc && typeof cc.path !== 'undefined') ? cc.path : null)

        cm.editConnectionConfiguration(cc.uuid, name, description, user, server, port, path)
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
        case EDIT:
            ConfigurationCommand.editAction()
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
