const uuidGenerator = require('uuid')

module.exports = class ConnectionConfiguration {
    // 扩展 password
    constructor (rawConnectionConfiguration) {
        ('uuid' in rawConnectionConfiguration) ? this.uuid = rawConnectionConfiguration.uuid : this.uuid = uuidGenerator()
        this.name = rawConnectionConfiguration.name
        this.description = rawConnectionConfiguration.description
        this.user = rawConnectionConfiguration.user
        this.server = rawConnectionConfiguration.server
        this.port = rawConnectionConfiguration.port
        this.path = rawConnectionConfiguration.path
        this.authentication = rawConnectionConfiguration.authentication
        this.password = rawConnectionConfiguration.password
    }

    serialize () {
        return {
            'uuid': this.uuid,
            'name': this.name,
            'description': this.description,
            'user': this.user,
            'server': this.server,
            'port': this.port,
            'path': this.path,
            'authentication': this.authentication,
            'password': this.password,
        }
    }

    static AUTHENTICATION_TYPE_NONE () {
        return 'no-authentication'
    }

    static AUTHENTICATION_TYPE_PEM () {
        return 'pem-authentication'
    }

    static AUTHENTICATION_TYPE_PASSWORD () {
        return 'password-authentication'
    }
}
