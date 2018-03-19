const CommandGenerator = require('../CommandGenerator')
const ConnectionConfiguration = require('../../lib/ConnectionConfiguration')
const SubCommand = require('./SubCommand')

module.exports = class ConnectionCommand extends SubCommand {
    static async run () {
        let projectConfiguration = await ConnectionCommand._selectConnectionConfiguration()
        let cc = new ConnectionConfiguration(projectConfiguration)
        let cg = new CommandGenerator(cc)
        await cg.generateVariables()
            .then(process.exit)
    }
}
