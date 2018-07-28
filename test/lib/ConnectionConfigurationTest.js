let assert = require('chai').assert
let ConnectionConfiguration = require('../../lib/ConnectionConfiguration')

describe('ConfigurationManager.js', () => {
    describe('serialize', () => {
        it('should return a serialized connection configuration into a JSON', () => {
            let connectionConfiguration = new ConnectionConfiguration({
                'uuid': '65e957bd-f495-4199-9835-52b511181357',
                'name': 'test',
                'description': 'my test connection',
                'user': 'foo',
                'server': '1.2.3.4',
                'port': '22',
                'path': '~',
                'authentication': {
                    'type': 'password-authentication'
                }
            })

            let result = connectionConfiguration.serialize()

            assert.containsAllKeys(result, ['uuid', 'name', 'description', 'user', 'server', 'port', 'path', 'authentication'])
        })
    })
})
