let uuidGenerator = require('uuid')

module.exports = class ConnectionConfiguration {
    constructor (rawConnectionConfiguration) {
        ('uuid' in rawConnectionConfiguration) ? this.uuid = rawConnectionConfiguration.uuid : this.uuid = uuidGenerator()
        this.name = rawConnectionConfiguration.name
        this.description = rawConnectionConfiguration.description
        this.user = rawConnectionConfiguration.user
        this.server = rawConnectionConfiguration.server
        this.port = rawConnectionConfiguration.port
    }

    serialize () {
        return {
            'uuid': this.uuid,
            'name': this.name,
            'description': this.description,
            'user': this.user,
            'server': this.server,
            'port': this.port
        }
    }
}
