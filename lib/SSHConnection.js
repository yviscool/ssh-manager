let spawn = require('child_process').spawn
let process = require('process')

module.exports = class SSHConnection {
    constructor (connectionConfiguration) {
        this.cc = connectionConfiguration
    }

    start (next) {
        let server = this.cc.server
        let ssh = spawn('ssh', this.generateSSHCommandParameters())
        ssh.on('close', onClose)
        ssh.stdout.once('data', onConnect)
        ssh.stdout.on('data', sshToOutput)
        ssh.stderr.on('data', sshToError)

        function onClose (code) {
            process.stdin.setRawMode(false)
            process.stdin.removeListener('data', inputToSsh)
            next(code)
        }

        function onConnect (data) {
            console.log('Connection to ' + server + ' started (type \'exit\' to close the connection).')
            process.stdin.setRawMode(true)
            process.stdin.resume()
            process.stdin.on('data', inputToSsh)
        }

        function sshToOutput (data) {
            process.stdout.write(data)
        }

        function sshToError (data) {
            process.stderr.write(data)
        }

        function inputToSsh (data) {
            ssh.stdin.write(data)
        }
    }

    generateSSHCommandParameters () {
        let sshCommandParameters = []

        sshCommandParameters.push('-tt')
        sshCommandParameters.push((this.cc.user !== null) ? this.cc.user + '@' + this.cc.server : this.cc.server)

        if ('port' in this.cc && typeof this.cc.port !== 'undefined') {
            sshCommandParameters.push('-p ' + this.cc.port)
        }

        if ('path' in this.cc && typeof this.cc.path !== 'undefined') {
            sshCommandParameters.push('cd ' + this.cc.path + '; exec $SHELL --login')
        }

        return sshCommandParameters
    }
}
