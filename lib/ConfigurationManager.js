let path = require('path')
let fs = require('fs')
let mkdirp = require('mkdirp')
let prettyjson = require('prettyjson')
let ConnectionConfiguration = require('./ConnectionConfiguration')

let connectionConfigurationFilePath = getUserHome() + '/.ssh-manager/connection_configuration.json'

function getUserHome () {
    return process.env.HOME || process.env.USERPROFILE
}

let getConnectionConfigurations = function () {
    if (!fs.existsSync(connectionConfigurationFilePath)) {
        mkdirp.sync(path.dirname(connectionConfigurationFilePath))
        fs.writeFileSync(connectionConfigurationFilePath, '[]')
        console.log('Connection configuration file initialized into "' + connectionConfigurationFilePath + '".')
    }

    return require(connectionConfigurationFilePath)
}

let saveConnectionConfiguration = function (connectionsData) {
    fs.writeFileSync(connectionConfigurationFilePath, JSON.stringify(connectionsData, null, 4))
}

let getConnectionDataWithPropertyValue = function (property, value) {
    let result = null

    connectionConfigurations.forEach((item) => {
        if (item[property] === value) {
            result = item
        }
    })

    return result
}

let connectionConfigurations = getConnectionConfigurations()

let configurationManager = {
    'addConnectionConfiguration': function (name, description, user, server, port) {
        let cc = new ConnectionConfiguration({
            'name': name,
            'description': description,
            'user': user,
            'server': server,
            'port': port
        })

        connectionConfigurations.push(cc.serialize())

        saveConnectionConfiguration(connectionConfigurations)
        console.log('connection configuration (' + cc.uuid + ') added')
    },

    'deleteConnectionConfiguration': function (uuid) {
        let deletedConnectionConfigurationCount = 0
        let connectionConfigurationsTruncated = []
        connectionConfigurations.forEach((item) => {
            if (item.uuid !== uuid) {
                connectionConfigurationsTruncated.push(item)
            } else {
                deletedConnectionConfigurationCount++
            }
        })

        if (deletedConnectionConfigurationCount !== 0) {
            saveConnectionConfiguration(connectionConfigurationsTruncated)
        }
        console.log('connection configuration (' + uuid + ') deleted')
    },

    'showConnectionConfigurations': function () {
        console.log(prettyjson.render(connectionConfigurations, {}))
    },

    'getConnectionConfigurationList': function () {
        return connectionConfigurations.map((item) => {
            return {
                'name': item.name,
                'value': item.uuid
            }
        })
    },

    'getConnectionConfiguration': function (uuid) {
        let connectionConfiguration = getConnectionDataWithPropertyValue('uuid', uuid)

        if (connectionConfiguration === null) {
            throw new Error('Undefined connection configuration with uuid : ' + uuid)
        }

        return connectionConfiguration
    },

    'getConnectionConfigurationFilePath': function () {
        return connectionConfigurationFilePath
    }
}

module.exports = configurationManager
