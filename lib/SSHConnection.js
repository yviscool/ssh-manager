let spawn = require('child_process').spawn

let ssh = null
let cc = null

let init = function (connectionConfiguration) {
    cc = connectionConfiguration
}

let start = function (next) {
    ssh = spawn('ssh', generateSSHCommandParameters())
    ssh.on('close', onClose)
    ssh.stdout.once('data', onConnect)
    ssh.stdout.on('data', sshToOutput)
    ssh.stderr.on('data', sshToError)

    function onClose (code) {
        process.stdin.setRawMode(false)
        process.stdin.removeListener('data', inputToSsh)
        next(code)
    }
}

function onConnect (data) {
    console.log('Connection start...')
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

function generateSSHCommandParameters () {
    let sshCommandParameters = []

    sshCommandParameters.push('-tt')
    sshCommandParameters.push((cc.user !== null) ? cc.user + '@' + cc.server : cc.server)

    if ('port' in cc && typeof cc.port !== 'undefined') {
        sshCommandParameters.push('-p ' + cc.port)
    }

    return sshCommandParameters
}

module.exports = {
    'init': init,
    'start': start
}
