let path = require('path')
let fs = require('fs')
let mkdirp = require('mkdirp')
let prettyjson = require('prettyjson')
let ConnectionConfiguration = require('./ConnectionConfiguration')

module.exports = class ConfigurationManager {
    constructor (connectionConfigurationFilePath) {
        this.ccfp = connectionConfigurationFilePath
        this.ccs = this.getConnectionConfigurations()
    }

    getConnectionConfigurations () {
        if (!fs.existsSync(this.ccfp)) {
            mkdirp.sync(path.dirname(this.ccfp))
            fs.writeFileSync(this.ccfp, '[]')
            console.log('Connection configuration file initialized into "' + this.ccfp + '".')
        }

        return require(this.ccfp)
    }

    saveConnectionConfiguration (connectionsData) {
        fs.writeFileSync(this.ccfp, JSON.stringify(connectionsData, null, 4))
    }

    getConnectionDataWithPropertyValue (property, value) {
        let result = null

        this.ccs.forEach((cc) => {
            if (cc[property] === value) {
                result = cc
            }
        })

        return result
    }

    addConnectionConfiguration (name, description, user, server, port) {
        let cc = new ConnectionConfiguration({
            'name': name,
            'description': description,
            'user': user,
            'server': server,
            'port': port
        })

        this.ccs.push(cc.serialize())

        this.saveConnectionConfiguration(this.ccs)
        console.log('connection configuration (' + cc.uuid + ') added')
    }

    deleteConnectionConfiguration (uuid) {
        let deletedConnectionConfigurationCount = 0
        let connectionConfigurationsTruncated = []
        this.ccs.forEach((cc) => {
            if (cc.uuid !== uuid) {
                connectionConfigurationsTruncated.push(cc)
            } else {
                deletedConnectionConfigurationCount++
            }
        })

        if (deletedConnectionConfigurationCount !== 0) {
            this.saveConnectionConfiguration(connectionConfigurationsTruncated)
        }
        console.log('connection configuration (' + uuid + ') deleted')
    }

    showConnectionConfigurations () {
        console.log(prettyjson.render(this.ccs, {}))
    }

    getConnectionConfigurationList () {
        return this.ccs.map((cc) => {
            return {
                'name': cc.name,
                'value': cc.uuid
            }
        })
    }

    getConnectionConfiguration (uuid) {
        let connectionConfiguration = this.getConnectionDataWithPropertyValue('uuid', uuid)

        if (connectionConfiguration === null) {
            throw new Error('Undefined connection configuration with uuid : ' + uuid)
        }

        return connectionConfiguration
    }
}
