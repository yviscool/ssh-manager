const fs = require('fs')
const child_process = require('child_process')
const { join } = require('path')
const { promisify } = require('util')
const replace = require('replace')
const ConnectionConfiguration = require('./ConnectionConfiguration')
const CCValidator = require('./validator/ConnectionConfigurationValidation')

const [copyFile, exec] = [promisify(fs.copyFile), promisify(child_process.exec)]

module.exports = class CommandGenerator {
    constructor(connectionConfiguration) {
        this.cc = connectionConfiguration
    }

    async generateVariables() {
        let command = await this._getCommand()
        await this._editVariable('SSH_MANAGER_COMMAND', command)

        return command
    }

    // async _getCommand () {
    //     let command = 'ssh'

    //     command += ' -p ' + this.cc.port
    //     if (CCValidator.validateAuthentication(this.cc.authentication)) {
    //         if (this.cc.authentication.type === ConnectionConfiguration.AUTHENTICATION_TYPE_PEM()) {
    //             command += ' -i ' + this._resolveHome(this.cc.authentication.pem_path)
    //         }
    //     }
    //     command += ' ' + this.cc.user + '@' + this.cc.server
    //     command += " -t 'cd " + this.cc.path + ";'"
    //     command += " 'exec $SHELL;'"

    //     return command
    // }

    // 扩展 sshpass 命令
    async _getCommand() {
        let command = 'sshpass'

        command += ' -p' + this.cc.password;

        command += ' ssh'

        command += ' -p ' + this.cc.port
        if (CCValidator.validateAuthentication(this.cc.authentication)) {
            if (this.cc.authentication.type === ConnectionConfiguration.AUTHENTICATION_TYPE_PEM()) {
                command += ' -i ' + this._resolveHome(this.cc.authentication.pem_path)
            }
        }
        command += ' ' + this.cc.user + '@' + this.cc.server
        command += " -t 'cd " + this.cc.path + ";'"
        command += " 'exec $SHELL;'"

        return command
    }


    // async _editVariable (variableName, variableValue) {
    //     replace({
    //         regex: variableName + '=.*',
    //         replacement: variableName + '="' + variableValue + '"',
    //         paths: [path.join(__dirname, '/../var/variables')],
    //         recursive: true,
    //         silent: true
    //     })
    // }

    async _editVariable(variableName, variableValue) {
        const toFilePath = '/tmp/terminal-' + Math.random().toString(36).substring(7)
        await copyFile(join(__dirname, '/../bin/ssh_login.sh'), toFilePath)
        replace({
            regex: "<<USER>>",
            replacement: this.cc.user,
            paths: [toFilePath],
            recursive: true,
            silent: true
        })
        replace({
            regex: "<<SERVER>>",
            replacement: this.cc.server,
            paths: [toFilePath],
            recursive: true,
            silent: true
        })
        replace({
            regex: "<<PASSWORD>>",
            replacement: this.cc.password,
            paths: [toFilePath],
            recursive: true,
            silent: true
        })
        replace({
            regex: "<<PRIVATE_KEY>>",
            replacement: "",
            paths: [toFilePath],
            recursive: true,
            silent: true
        })
        replace({
            regex: "<<PORT>>",
            replacement: this.cc.port,
            paths: [toFilePath],
            recursive: true,
            silent: true
        })
        replace({
            regex: "<<AUTHENTICATION>>",
            replacement: "no",
            paths: [toFilePath],
            recursive: true,
            silent: true
        })
        replace({
            regex: "<<REMOTE_COMMAND>>",
            replacement: this.cc.remoteCommand,
            paths: [toFilePath],
            recursive: true,
            silent: true
        })

        replace({
            regex: variableName + '=.*',
            replacement: variableName + '="' + toFilePath + '"',
            paths: [join(__dirname, '/../var/variables')],
            recursive: true,
            silent: true
        })
    }

    _resolveHome(filepath) {
        if (filepath[0] === '~') {
            return join(process.env.HOME, filepath.slice(1))
        }
        return filepath
    }
}
