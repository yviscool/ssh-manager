let spawn = require('child_process').spawn
let process = require('process')

module.exports = class SSHConnection {
    constructor (connectionConfiguration) {
        this._cc = connectionConfiguration
    }

    start (next) {
        let server = this._cc.server
        let ssh = spawn('ssh', this._generateSSHCommandParameters())
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

    _generateSSHCommandParameters () {
        let sshCommandParameters = []

        sshCommandParameters.push('-tt')
        sshCommandParameters.push((this._cc.user !== null) ? this._cc.user + '@' + this._cc.server : this._cc.server)

        if ('port' in this._cc && typeof this._cc.port !== 'undefined') {
            sshCommandParameters.push('-p ' + this._cc.port)
        }

        if ('path' in this._cc && typeof this._cc.path !== 'undefined') {
            sshCommandParameters.push('cd ' + this._cc.path + '; exec $SHELL --login')
        }

        return sshCommandParameters
    }
}
