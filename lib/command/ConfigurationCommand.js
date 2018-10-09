const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const mkdirp = require('mkdirp')
const prompt = inquirer.createPromptModule()
const colors = require('../../app/colors-custom')
const cm = require('../../app/configuration-manager')
const ConnectionConfiguration = require('../ConnectionConfiguration')
const CCValidator = require('../validator/ConnectionConfigurationValidation')
const SubCommand = require('./SubCommand')

const CREATE = 'create'
const EDIT = 'edit'
const DELETE = 'delete'
const SHOW_ONE = 'show-one'
const SHOW_ALL = 'show-all'
const EXPORT = 'export'
const IMPORT = 'import'

module.exports = class ConfigurationCommand extends SubCommand {
    static async _confirmMessage (message, defaultValue = null) {
        let confInquirer = {
            type: 'confirm',
            message: message,
            name: 'confirmation',
            default: defaultValue
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

    static async _getConnectionConfigurationProperty (message, name, defaultValue = null, validationFunction = null) {
        let inputNameInquirer = {
            type: 'input',
            message: message,
            name: name,
            default: defaultValue
        }

        let property = await prompt(inputNameInquirer)

        if (validationFunction !== null) {
            let errors = validationFunction(property[name])
            if (errors.length !== 0) {
                errors.forEach((error) => console.log(error))
                property[name] = await ConfigurationCommand._getConnectionConfigurationProperty(message, name, defaultValue, validationFunction)
            }
        }

        return property[name]
    }

    static async _getConnectionConfigurationAuthenticationProperty (defaultValue = {}) {
        let authentication = {}
        authentication.type = await ConfigurationCommand._getConnectionConfigurationAuthenticationTypeProperty(('type' in defaultValue && typeof defaultValue.type !== 'undefined') ? defaultValue.type : null)

        if (authentication.type === ConnectionConfiguration.AUTHENTICATION_TYPE_PEM()) {
            authentication.pem_path = await ConfigurationCommand._getConnectionConfigurationProperty('Pem path', 'pem_path', ('pem_path' in defaultValue && typeof defaultValue.pem_path !== 'undefined') ? defaultValue.pem_path : '~/.ssh/id_rsa')
        }

        if (CCValidator.validateAuthentication(authentication).length !== 0) {
            authentication = await ConfigurationCommand._getConnectionConfigurationAuthenticationProperty(defaultValue)
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
        return new Promise(async (resolve) => {
            let exportPath = await ConfigurationCommand._getFilePath('Export file path', '~/export.json')
            exportPath = ConfigurationCommand._resolveHome(exportPath)
            if (fs.existsSync(exportPath)) {
                let confirm = await ConfigurationCommand._confirmMessage('The file "' + exportPath + '" already exist! Override it?', 'yes')
                if (!confirm) {
                    ConfigurationCommand._exportAction()
                } else {
                    resolve(exportPath)
                }
            } else {
                let dir = path.dirname(exportPath)
                if (!fs.existsSync(dir)) {
                    let confirm = await ConfigurationCommand._confirmMessage('The directory "' + dir + '" don\'t exist! Create it?', 'yes')
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
        return new Promise(async (resolve) => {
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
        let name = await ConfigurationCommand._getConnectionConfigurationProperty('Connection name', 'name', 'custom connection', CCValidator.validateName)
        let description = await ConfigurationCommand._getConnectionConfigurationProperty('Description', 'description', 'my custom connection', CCValidator.validateDescription)
        let user = await ConfigurationCommand._getConnectionConfigurationProperty('User', 'user', 'root', CCValidator.validateUser)
        let server = await ConfigurationCommand._getConnectionConfigurationProperty('Server', 'server', '192.168.1.1', CCValidator.validateServer)
        let port = await ConfigurationCommand._getConnectionConfigurationProperty('Port', 'port', '22', CCValidator.validatePort)
        let path = await ConfigurationCommand._getConnectionConfigurationProperty('Path', 'path', '~', CCValidator.validatePath)
        let authentication = await ConfigurationCommand._getConnectionConfigurationAuthenticationProperty({}, CCValidator.validateAuthentication)

        cm.addConnectionConfiguration(name, description, user, server, port, path, authentication)
    }

    static async _editAction () {
        let cc = await ConfigurationCommand._selectConnectionConfiguration()
        let name = await ConfigurationCommand._getConnectionConfigurationProperty('Connection name', 'name', CCValidator.validateName(cc.name).length === 0 ? cc.name : null, CCValidator.validateName)
        let description = await ConfigurationCommand._getConnectionConfigurationProperty('Description', 'description', CCValidator.validateDescription(cc.description).length === 0 ? cc.description : null, CCValidator.validateDescription)
        let user = await ConfigurationCommand._getConnectionConfigurationProperty('User', 'user', CCValidator.validateUser(cc.user).length === 0 ? cc.user : null, CCValidator.validateUser)
        let server = await ConfigurationCommand._getConnectionConfigurationProperty('Server', 'server', CCValidator.validateServer(cc.server).length === 0 ? cc.server : null, CCValidator.validateServer)
        let port = await ConfigurationCommand._getConnectionConfigurationProperty('Port', 'port', CCValidator.validatePort(cc.port).length === 0 ? cc.port : null, CCValidator.validatePort)
        let path = await ConfigurationCommand._getConnectionConfigurationProperty('Path', 'path', CCValidator.validatePath(cc.path).length === 0 ? cc.path : null, CCValidator.validatePath)
        let authentication = await ConfigurationCommand._getConnectionConfigurationAuthenticationProperty(CCValidator.validateAuthentication(cc.authentication).length === 0 ? cc.authentication : {})

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
