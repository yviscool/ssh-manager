let sinon = require('sinon')
let ConfigurationManager = require('../../lib/ConfigurationManager')
let ConnectionConfiguration = require('../../lib/ConnectionConfiguration')

describe('ConfigurationManager.js', () => {
    describe('addConnectionConfiguration', () => {
        it('should create a new connection configuration', () => {
            let configurationManager = new ConfigurationManager()
            let mock = sinon.mock(configurationManager)
            mock.expects('_saveConnectionConfiguration')
                .once()
                .returns(null)
            configurationManager.addConnectionConfiguration('test', 'my test connection', 'root', '1.2.3.4', '22', '~', ConnectionConfiguration.AUTHENTICATION_TYPE_PASSWORD())
            mock.verify()
            mock.restore()
        })
    })
    describe('editConnectionConfiguration', () => {
        it('should update an existing connection configuration', () => {
            let configurationManager = new ConfigurationManager()
            let mock = sinon.mock(configurationManager)
            mock.expects('_saveConnectionConfiguration')
                .once()
                .returns(null)
            configurationManager.editConnectionConfiguration('test', 'my test connection', 'root', '1.2.3.4', '22', '~', ConnectionConfiguration.AUTHENTICATION_TYPE_PASSWORD())
            mock.verify()
            mock.restore()
        })
    })
    xdescribe('deleteConnectionConfiguration', () => {
        it('should delete an existing connection configuration', () => {

        })
    })
    xdescribe('showConnectionConfigurations', () => {
        it('should show all existing connection configurations', () => {

        })
    })
    xdescribe('showConnectionConfiguration', () => {
        it('should show an existing connection configuration', () => {

        })
    })
    xdescribe('getConnectionConfigurationList', () => {
        it('should return an array of all existing connection configurations', () => {

        })
    })
    xdescribe('getConnectionConfigurationIndex', () => {
        it('should return index of an existing connection configuration', () => {

        })
    })
    xdescribe('getConnectionConfiguration', () => {
        it('should return an existing connection configuration', () => {

        })
    })
    xdescribe('exportConnectionConfigurationFile', () => {
        it('should export existing connection configurations into an export file', () => {

        })
    })
    xdescribe('importConnectionConfigurationFile', () => {
        it('should import connection configurations from an export file', () => {

        })
    })
})
