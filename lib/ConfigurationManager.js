const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const prettyjson = require('prettyjson')
const ConnectionConfiguration = require('./ConnectionConfiguration')

module.exports = class ConfigurationManager {
    constructor (connectionConfigurationFilePath = null) {
        if (connectionConfigurationFilePath === null) {
            this.ccs = []
            return
        }
        this.ccfp = connectionConfigurationFilePath
        this.ccs = this._getConnectionConfigurations()
    }

    _getConnectionConfigurations () {
        if (!fs.existsSync(this.ccfp)) {
            mkdirp.sync(path.dirname(this.ccfp))
            fs.writeFileSync(this.ccfp, '[]')
            console.log('Connection configuration file initialized into "' + this.ccfp + '".')
        }

        return require(this.ccfp)
    }

    _saveConnectionConfiguration (cc, filePath = this.ccfp) {
        fs.writeFileSync(filePath, JSON.stringify(cc, null, 4))
    }

    _getConnectionConfigurationWithPropertyValue (property, value) {
        let result = null

        this.ccs.forEach((cc) => {
            if (cc[property] === value) {
                result = cc
            }
        })

        return result
    }

    setConfiguration (connectionConfigurationFilePath) {
        this.ccfp = connectionConfigurationFilePath
        this.ccs = this._getConnectionConfigurations()
    }

    addConnectionConfiguration (name, description, user, server, port, path, authentication) {
        let cc = new ConnectionConfiguration({
            'name': name,
            'description': description,
            'user': user,
            'server': server,
            'port': port,
            'path': path,
            'authentication': authentication
        })

        this.ccs.push(cc.serialize())

        this._saveConnectionConfiguration(this.ccs)
        console.log('connection configuration (' + cc.uuid + ') successfully added')
    }

    editConnectionConfiguration (uuid, name, description, user, server, port, path, authentication) {
        let cc = new ConnectionConfiguration({
            'uuid': uuid,
            'name': name,
            'description': description,
            'user': user,
            'server': server,
            'port': port,
            'path': path,
            'authentication': authentication
        })

        let ccIndex = this.getConnectionConfigurationIndex(cc.uuid)
        this.ccs = this.ccs.map((item, index) => index === ccIndex ? cc : item)

        this._saveConnectionConfiguration(this.ccs)
        console.log('connection configuration (' + cc.uuid + ') successfully updated')
    }

    deleteConnectionConfiguration (uuid) {
        let ccDeletedCount = 0
        let ccsUpdated = []
        this.ccs.forEach((cc) => {
            if (cc.uuid !== uuid) {
                ccsUpdated.push(cc)
            } else {
                ccDeletedCount++
            }
        })

        if (ccDeletedCount !== 0) {
            this._saveConnectionConfiguration(ccsUpdated)
        }
        console.log('connection configuration (' + uuid + ') successfully deleted')
    }

    showConnectionConfigurations () {
        console.log(prettyjson.render(this.ccs, {}))
    }

    showConnectionConfiguration (uuid) {
        let cc = this.getConnectionConfiguration(uuid)

        console.log(prettyjson.render(cc, {}))
    }

    getConnectionConfigurationList () {
        return this.ccs.map((cc) => {
            return {
                'name': cc.name,
                'value': cc.uuid
            }
        })
    }

    getConnectionConfigurationIndex (uuid) {
        return this.ccs.findIndex((cc) => {
            return cc.uuid === uuid
        })
    }

    getConnectionConfiguration (uuid) {
        let connectionConfiguration = this._getConnectionConfigurationWithPropertyValue('uuid', uuid)

        if (connectionConfiguration === null) {
            throw new Error('Undefined connection configuration with uuid : ' + uuid)
        }

        return connectionConfiguration
    }

    exportConnectionConfigurationFile (destination) {
        this._saveConnectionConfiguration(this.ccs, destination)
        console.log('connection configuration file successfully exported')
    }

    importConnectionConfigurationFile (source) {
        this._saveConnectionConfiguration(require(source))
        console.log('connection configuration file successfully imported')
    }
}
