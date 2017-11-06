let SSHConnection = require('../../lib/SSHConnection')
let ConnectionConfiguration = require('../../lib/ConnectionConfiguration')
let SubCommand = require('./SubCommand')

module.exports = class ConnectionCommand extends SubCommand {
    static async run () {
        let projectConfiguration = await ConnectionCommand._selectConnectionConfiguration()
        let cc = new ConnectionConfiguration(projectConfiguration)
        let sc = new SSHConnection(cc)
        sc.start(process.exit)
    }
}
