const Client = require('ssh2').Client
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const colors = require('../app/colors-custom')
const ConnectionConfiguration = require('./ConnectionConfiguration')
const CCValidator = require('./validator/ConnectionConfigurationValidation')
const prompt = inquirer.createPromptModule()

module.exports = class SSHClient {
    constructor (connectionConfiguration) {
        this.cc = connectionConfiguration
    }

    async run () {
        let client = await this._getClient()
        let shell = await this._runShell(client)
        console.log('Connection to ' + this.cc.server + ' closed.')
        return shell
    }

    async _getClient () {
        const clientOptions = await this._getSSHClientOptions()

        return this._createClient(clientOptions)
    }

    _createClient (clientOptions) {
        return new Promise((resolve) => {
            const client = new Client()
            client.on('ready', () => {
                resolve(client)
            }).on('error', () => {
                console.log(colors.error('connection problem : please check your connection settings'))
                process.exit(1)
            })
            return client
                .connect(clientOptions)
        })
    }

    async _getSSHClientOptions () {
        let options = {}
        options.username = this.cc.user
        options.host = this.cc.server
        options.port = this.cc.port

        if (CCValidator.validateAuthentication(this.cc.authentication)) {
            switch (this.cc.authentication.type) {
                case ConnectionConfiguration.AUTHENTICATION_TYPE_PASSWORD():
                    options.password = await this._getPassword()
                    break
                case ConnectionConfiguration.AUTHENTICATION_TYPE_PEM():
                    options.privateKey = fs.readFileSync(this._resolveHome(this.cc.authentication.pem_path))
                    break
            }
        }

        if (process.env.SSH_AUTH_SOCK) {
            options.agent = process.env.SSH_AUTH_SOCK
        }

        return options
    }

    _runShell (client) {
        return new Promise((resolve, reject) => {
            client.shell((err, stream) => {
                if (err) {
                    reject(err)
                } else {
                    process.stdin.setRawMode(true)
                    process.stdin.pipe(stream)
                    stream.pipe(process.stdout)
                    stream.stderr.pipe(process.stderr)
                    stream.setWindow(process.stdout.rows, process.stdout.columns)
                    process.stdout.on('resize', () => {
                        stream.setWindow(process.stdout.rows, process.stdout.columns)
                    })

                    // todo: use event/callback instead of timeout
                    setTimeout(() => {
                        stream.stdin.write('cd ' + this.cc.path + '\n')
                    }, 100)

                    const listeners = process.stdin.listeners('keypress')
                    process.stdin.removeAllListeners('keypress')

                    stream.on('close', () => {
                        process.stdin.setRawMode(false)
                        process.stdin.unpipe(stream)
                        process.stdin.unref()
                        listeners.forEach(listener => process.stdin.addListener('keypress', listener))
                        client.end()
                        resolve()
                    })
                }
            })
        })
    }

    async _getPassword () {
        let inputPasswordInquirer = {
            type: 'password',
            name: 'password',
            message: 'Input password'
        }
        let result = await prompt(inputPasswordInquirer)

        return result.password
    }

    _resolveHome (filepath) {
        if (filepath[0] === '~') {
            return path.join(process.env.HOME, filepath.slice(1))
        }
        return filepath
    }
}
