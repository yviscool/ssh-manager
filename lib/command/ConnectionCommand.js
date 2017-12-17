const SSHClient = require('../../lib/SSHClient')
const ConnectionConfiguration = require('../../lib/ConnectionConfiguration')
const SubCommand = require('./SubCommand')

module.exports = class ConnectionCommand extends SubCommand {
    static async run () {
        let projectConfiguration = await ConnectionCommand._selectConnectionConfiguration()
        let cc = new ConnectionConfiguration(projectConfiguration)
        let sc = new SSHClient(cc)
        await sc.run()
            .then(process.exit)
    }
}
