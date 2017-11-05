let ConfigurationManager = require('../lib/ConfigurationManager')

function getUserHome () {
    return process.env.HOME || process.env.USERPROFILE
}

let connectionConfigurationFilePath = getUserHome() + '/.ssh-manager/connection_configuration.json'

module.exports = new ConfigurationManager(connectionConfigurationFilePath)
