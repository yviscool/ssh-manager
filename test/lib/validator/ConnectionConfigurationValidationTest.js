let assert = require('chai').assert
let ConnectionConfigurationValidation = require('../../../lib/validator/ConnectionConfigurationValidation')

describe('ConnectionConfigurationValidation.js', () => {
    describe('validateUuid', () => {
        it('should check if the parameter given is a string', () => {
            assert.isArray(ConnectionConfigurationValidation.validateUuid(null))
            assert.equal(ConnectionConfigurationValidation.validateUuid(null).length, 1)
            assert.isArray(ConnectionConfigurationValidation.validateUuid(65e957))
            assert.equal(ConnectionConfigurationValidation.validateUuid(65e957).length, 1)
        })

        it('should check if the parameter given is an uuid', () => {
            assert.isEmpty(ConnectionConfigurationValidation.validateUuid('65e957bd-f495-4199-9835-52b511181357'))
            assert.isArray(ConnectionConfigurationValidation.validateUuid(''))
            assert.equal(ConnectionConfigurationValidation.validateUuid('').length, 1)
            assert.isArray(ConnectionConfigurationValidation.validateUuid('123'))
            assert.equal(ConnectionConfigurationValidation.validateUuid('123').length, 1)
        })
    })
    describe('validateName', () => {
        it('should check if the parameter given is a string', () => {
            assert.isEmpty(ConnectionConfigurationValidation.validateName('My connection'))
            assert.isArray(ConnectionConfigurationValidation.validateName(''))
            assert.equal(ConnectionConfigurationValidation.validateName('').length, 1)
        })

        it('should check if the parameter given is not null', () => {
            assert.isArray(ConnectionConfigurationValidation.validateName(null))
            assert.equal(ConnectionConfigurationValidation.validateName(null).length, 1)
        })
    })
    describe('validateDescription', () => {
        it('should check if the parameter given is a string', () => {
            assert.isEmpty(ConnectionConfigurationValidation.validateDescription('Connection description'))
            assert.isEmpty(ConnectionConfigurationValidation.validateDescription(''))
            assert.isArray(ConnectionConfigurationValidation.validateDescription(null))
            assert.equal(ConnectionConfigurationValidation.validateDescription(null).length, 1)
        })
    })
    describe('validateUser', () => {
        it('should check if the parameter given is a string', () => {
            assert.isEmpty(ConnectionConfigurationValidation.validateUser('root'))
            assert.isArray(ConnectionConfigurationValidation.validateUser(''))
            assert.equal(ConnectionConfigurationValidation.validateUser('').length, 1)
        })

        it('should check if the parameter given is not null', () => {
            assert.isArray(ConnectionConfigurationValidation.validateUser(null))
            assert.equal(ConnectionConfigurationValidation.validateUser(null).length, 1)
        })
    })
    describe('validateServer', () => {
        it('should check if the parameter given is not null', () => {
            assert.isArray(ConnectionConfigurationValidation.validateServer(null))
            assert.equal(ConnectionConfigurationValidation.validateServer(null).length, 1)
        })

        it('should check if the parameter given is a valid ip v4', () => {
            assert.isEmpty(ConnectionConfigurationValidation.validateServer('127.0.0.1'))
            assert.isEmpty(ConnectionConfigurationValidation.validateServer('8.8.8.8'))
        })

        it('should check if the parameter given is a valid ip v6', () => {
            assert.isEmpty(ConnectionConfigurationValidation.validateServer('::1'))
            assert.isEmpty(ConnectionConfigurationValidation.validateServer('2001:0db8:0000:85a3:0000:0000:ac1f:8001'))
        })

        it('should check if the parameter given is a valid FQDN', () => {
            assert.isEmpty(ConnectionConfigurationValidation.validateServer('my-server.com'))
        })
    })
    describe('validatePort', () => {
        it('should check if the parameter given is not null', () => {
            assert.isArray(ConnectionConfigurationValidation.validatePort(null))
            assert.equal(ConnectionConfigurationValidation.validatePort(null).length, 1)
        })

        it('should check if the parameter given is a valid port', () => {
            assert.isEmpty(ConnectionConfigurationValidation.validatePort('22'))
            assert.isEmpty(ConnectionConfigurationValidation.validatePort('65535'))
            assert.isArray(ConnectionConfigurationValidation.validatePort(''))
            assert.equal(ConnectionConfigurationValidation.validatePort('').length, 1)
            assert.isArray(ConnectionConfigurationValidation.validatePort('65536'))
            assert.equal(ConnectionConfigurationValidation.validatePort('65536').length, 1)
        })
    })
    describe('validatePath', () => {
        it('should check if the parameter given is a string', () => {
            assert.isEmpty(ConnectionConfigurationValidation.validatePath('/home/test'))
        })

        it('should check if the parameter given is not null', () => {
            assert.isArray(ConnectionConfigurationValidation.validatePath(null))
            assert.equal(ConnectionConfigurationValidation.validatePath(null).length, 1)
        })
    })
    describe('validateAuthentication', () => {
        it('should check if the parameter given is a valid object for a "no authentication" configuration', () => {
            assert.isEmpty(ConnectionConfigurationValidation.validateAuthentication({'type': 'no-authentication'}))
        })
        it('should check if the parameter given is a valid object for a pem configuration', () => {
            assert.isEmpty(ConnectionConfigurationValidation.validateAuthentication({'type': 'pem-authentication', 'pem_path': '~'}))
            assert.isArray(ConnectionConfigurationValidation.validateAuthentication({'type': 'pem-authentication'}))
            assert.equal(ConnectionConfigurationValidation.validateAuthentication({'type': 'pem-authentication'}).length, 1)
        })
        it('should check if the parameter given is a valid object for a password configuration', () => {
            assert.isEmpty(ConnectionConfigurationValidation.validateAuthentication({'type': 'password-authentication'}))
        })
    })
})
