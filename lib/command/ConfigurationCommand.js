const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const mkdirp = require('mkdirp')
const prompt = inquirer.createPromptModule()
const colors = require('../../app/colors-custom')
const cm = require('../../app/configuration-manager')
const ConnectionConfiguration = require('../ConnectionConfiguration')
const SubCommand = require('./SubCommand')

const CREATE = 'create'
const EDIT = 'edit'
const DELETE = 'delete'
const SHOW_ONE = 'show-one'
const SHOW_ALL = 'show-all'
const EXPORT = 'export'
const IMPORT = 'import'

module.exports = class ConfigurationCommand extends SubCommand {
    static async _confirmMessage (message) {
        let confInquirer = {
            type: 'confirm',
            message: message,
            name: 'confirmation',
            default: '~/export.json'
        }

        let result = await prompt(confInquirer)

        return result['confirmation']
    }

    static async _getFilePath (message, defaultValue = null) {
        let confInquirer = {
            type: 'input',
            message: message,
            name: 'path',
            default: defaultValue
        }

        let result = await prompt(confInquirer)

        return result['path']
    }

    static async _getConnectionConfigurationProperty (message, name, defaultValue = null) {
        let inputNameInquirer = {
            type: 'input',
            message: message,
            name: name,
            default: defaultValue
        }

        let property = await prompt(inputNameInquirer)

        return property[name]
    }

    static async _getConnectionConfigurationAuthenticationProperty (defaultValue = {}) {
        let authentication = {}
        authentication.type = await ConfigurationCommand._getConnectionConfigurationAuthenticationTypeProperty(('type' in defaultValue && typeof defaultValue.type !== 'undefined') ? defaultValue.type : null)

        if (authentication.type === ConnectionConfiguration.AUTHENTICATION_TYPE_PEM()) {
            authentication.pem_path = await ConfigurationCommand._getConnectionConfigurationProperty('Pem path', 'pem_path', ('pem_path' in defaultValue && typeof defaultValue.pem_path !== 'undefined') ? defaultValue.pem_path : '~/.ssh/id_rsa')
        }

        return authentication
    }

    static async _getConnectionConfigurationAuthenticationTypeProperty (defaultValue = null) {
        let allAuthenticationTypesChoices = [
            {
                'name': 'no authentication',
                'value': ConnectionConfiguration.AUTHENTICATION_TYPE_NONE()
            },
            {
                'name': 'authentication with pem',
                'value': ConnectionConfiguration.AUTHENTICATION_TYPE_PEM()
            },
            {
                'name': 'authentication with password',
                'value': ConnectionConfiguration.AUTHENTICATION_TYPE_PASSWORD()
            }
        ]

        let inputNameInquirer = {
            type: 'list',
            message: 'Select an authentication',
            name: 'authentication_type',
            choices: allAuthenticationTypesChoices,
            default: defaultValue
        }

        let result = await prompt(inputNameInquirer)

        return result.authentication_type
    }

    static async _selectConfigurationAction () {
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
            },
            {
                'name': 'export all connection configurations into file',
                'value': EXPORT
            },
            {
                'name': 'import an connection configuration file',
                'value': IMPORT
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

    static async _getExportPath () {
        return new Promise(async (resolve, reject) => {
            let exportPath = await ConfigurationCommand._getFilePath('Export file path', '~/export.json')
            exportPath = ConfigurationCommand._resolveHome(exportPath)
            if (fs.existsSync(exportPath)) {
                let confirm = await ConfigurationCommand._confirmMessage('The file "' + exportPath + '" already exist! Override it?')
                if (!confirm) {
                    ConfigurationCommand._exportAction()
                } else {
                    resolve(exportPath)
                }
            } else {
                let dir = path.dirname(exportPath)
                if (!fs.existsSync(dir)) {
                    let confirm = await ConfigurationCommand._confirmMessage('The directory "' + dir + '" don\'t exist! Create it?')
                    if (!confirm) {
                        ConfigurationCommand._exportAction()
                    } else {
                        try {
                            mkdirp.sync(dir)
                            resolve(exportPath)
                        } catch (e) {
                            console.error(colors.error(e.message))
                            process.exit(1)
                        }
                    }
                } else {
                    resolve(exportPath)
                }
            }
        })
    }

    static async _getImportPath () {
        return new Promise(async (resolve, reject) => {
            let importPath = await ConfigurationCommand._getFilePath('Import file path')
            importPath = ConfigurationCommand._resolveHome(importPath)
            if (!fs.existsSync(importPath)) {
                console.error(colors.error('"' + importPath + '" file don\'t exist.'))
                ConfigurationCommand._importAction()
            } else {
                resolve(importPath)
            }
        })
    }

    static async _createAction () {
        let name = await ConfigurationCommand._getConnectionConfigurationProperty('Connection name', 'name', 'custom connection')
        let description = await ConfigurationCommand._getConnectionConfigurationProperty('Description', 'description', 'my custom connection')
        let user = await ConfigurationCommand._getConnectionConfigurationProperty('User', 'user', 'root')
        let server = await ConfigurationCommand._getConnectionConfigurationProperty('Server', 'server', '192.168.1.1')
        let port = await ConfigurationCommand._getConnectionConfigurationProperty('Port', 'port', '22')
        let path = await ConfigurationCommand._getConnectionConfigurationProperty('Path', 'path', '~')
        let authentication = await ConfigurationCommand._getConnectionConfigurationAuthenticationProperty()

        cm.addConnectionConfiguration(name, description, user, server, port, path, authentication)
    }

    static async _editAction () {
        let cc = await ConfigurationCommand._selectConnectionConfiguration()
        let name = await ConfigurationCommand._getConnectionConfigurationProperty('Connection name', 'name', ('name' in cc && typeof cc.name !== 'undefined') ? cc.name : null)
        let description = await ConfigurationCommand._getConnectionConfigurationProperty('Description', 'description', ('description' in cc && typeof cc.description !== 'undefined') ? cc.description : null)
        let user = await ConfigurationCommand._getConnectionConfigurationProperty('User', 'user', ('user' in cc && typeof cc.user !== 'undefined') ? cc.user : null)
        let server = await ConfigurationCommand._getConnectionConfigurationProperty('Server', 'server', ('server' in cc && typeof cc.server !== 'undefined') ? cc.server : null)
        let port = await ConfigurationCommand._getConnectionConfigurationProperty('Port', 'port', ('port' in cc && typeof cc.port !== 'undefined') ? cc.port : null)
        let path = await ConfigurationCommand._getConnectionConfigurationProperty('Path', 'path', ('path' in cc && typeof cc.path !== 'undefined') ? cc.path : null)
        let authentication = await ConfigurationCommand._getConnectionConfigurationAuthenticationProperty(('authentication' in cc && typeof cc.authentication !== 'undefined') ? cc.authentication : {})

        cm.editConnectionConfiguration(cc.uuid, name, description, user, server, port, path, authentication)
    }

    static async _deleteAction () {
        let cc = await ConfigurationCommand._selectConnectionConfiguration()
        cm.deleteConnectionConfiguration(cc.uuid)
    }

    static async _showOneAction () {
        let cc = await ConfigurationCommand._selectConnectionConfiguration()
        cm.showConnectionConfiguration(cc.uuid)
    }

    static async _showAllAction () {
        cm.showConnectionConfigurations()
    }

    static async _exportAction () {
        let exportPath = await ConfigurationCommand._getExportPath()
        cm.exportConnectionConfigurationFile(exportPath)
    }

    static async _importAction () {
        let importPath = await ConfigurationCommand._getImportPath()
        cm.importConnectionConfigurationFile(importPath)
    }

    static _resolveHome (filepath) {
        if (filepath[0] === '~') {
            return path.join(process.env.HOME, filepath.slice(1))
        }
        return filepath
    }

    static async run () {
        let action = await ConfigurationCommand._selectConfigurationAction()

        switch (action) {
            case CREATE:
                ConfigurationCommand._createAction()
                break
            case EDIT:
                ConfigurationCommand._editAction()
                break
            case DELETE:
                ConfigurationCommand._deleteAction()
                break
            case SHOW_ONE:
                ConfigurationCommand._showOneAction()
                break
            case SHOW_ALL:
                ConfigurationCommand._showAllAction()
                break
            case EXPORT:
                ConfigurationCommand._exportAction()
                break
            case IMPORT:
                ConfigurationCommand._importAction()
                break
        }
    }
}
