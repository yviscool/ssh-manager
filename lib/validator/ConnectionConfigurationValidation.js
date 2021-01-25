const validator = require('validator')
const ConnectionConfiguration = require('../ConnectionConfiguration')

module.exports = class ConnectionConfigurationValidation {
    static validateUuid (uuid) {
        let errors = []
        if (typeof uuid !== 'string') {
            errors.push('"uuid" must be a string')
            return errors
        }
        if (!validator.isUUID(uuid)) {
            errors.push('"uuid" must be valid UUID : "' + uuid + '" given')
            return errors
        }
        return errors
    }

    static validateName (name) {
        let errors = []
        if (typeof name !== 'string') {
            errors.push('"name" must be a string : "' + name + '" given')
            return errors
        }

        if (name.length === 0) {
            errors.push('"name" cannot be empty')
            return errors
        }
        return errors
    }

    static validateDescription (description) {
        let errors = []
        if (typeof description !== 'string') {
            errors.push('"description" must be a string : "' + description + '" given')
            return errors
        }
        return errors
    }

    static validateUser (user) {
        let errors = []
        if (typeof user !== 'string') {
            errors.push('"user" must be a string : "' + user + '" given')
            return errors
        }

        if (user.length === 0) {
            errors.push('"user" cannot be empty')
            return errors
        }
        return errors
    }

    static validateServer (server) {
        let errors = []
        if (typeof server !== 'string') {
            errors.push('"server" must be a string')
            return errors
        }
        if (!validator.isIP(server) && !validator.isFQDN(server)) {
            errors.push('"server" must be an ip or FQDN : "' + server + '" given')
            return errors
        }
        return errors
    }

    static validatePort (port) {
        let errors = []
        if (typeof port !== 'string') {
            errors.push('"port" must be a string')
            return errors
        }
        if (!validator.isPort(port)) {
            errors.push('"port" must be an valid port : "' + port + '" given')
            return errors
        }
        return errors
    }

    static validatePath (path) {
        let errors = []
        if (typeof path !== 'string') {
            errors.push('"path" must be a string : "' + path + '" given')
            return errors
        }

        if (path.length === 0) {
            errors.push('"path" cannot be empty')
            return errors
        }
        return errors
    }

    static validateAuthentication (authentication) {
        let errors = []
        if (typeof authentication !== 'object') {
            errors.push('"authentication" must be a object : "' + authentication + '" given')
            return errors
        }
        if ('type' in authentication === false) {
            errors.push('"authentication" without "type"')
            return errors
        }
        if (authentication.type !== ConnectionConfiguration.AUTHENTICATION_TYPE_NONE() && authentication.type !== ConnectionConfiguration.AUTHENTICATION_TYPE_PASSWORD() && authentication.type !== ConnectionConfiguration.AUTHENTICATION_TYPE_PEM()) {
            errors.push('"authentication.type" is not valid')
            return errors
        }
        if (authentication.type === ConnectionConfiguration.AUTHENTICATION_TYPE_PEM()) {
            if ('pem_path' in authentication === false) {
                errors.push('"authentication" with the type "' + ConnectionConfiguration.AUTHENTICATION_TYPE_PEM() + '" without "pem_path"')
                return errors
            }
            if (typeof authentication.pem_path !== 'string') {
                errors.push('"authentication.pem_path" must be a string : "' + authentication.pem_path + '" given')
                return errors
            }
            if (authentication.pem_path.length === 0) {
                errors.push('"authentication.pem_path" cannot be empty')
                return errors
            }
        }
        return errors
    }

    // 扩展
    static validateRemoteCommand (cmd) {
        let errors = []
        if (typeof cmd !== 'string') {
            errors.push('"Remote command" must be a string : "' + cmd + '" given')
            return errors
        }

        if (cmd.length === 0) {
            errors.push('"Remote command" cannot be empty')
            return errors
        }
        return errors
    }

    // 扩展
    static validateSort (sort) {
        let errors = []
        if (typeof sort!== 'number') {
            errors.push('"sort" must be a number: "' + sort + '" given')
            return errors
        }

        if (sort.length === 0) {
            errors.push('"sort" cannot be empty')
            return errors
        }
        return errors
    }


    // 扩展
    static validatePassword (password) {
        let errors = []
        if (typeof password !== 'string') {
            errors.push('"password" must be a string : "' )
            return errors
        }

        if (password.length === 0) {
            errors.push('"password" cannot be empty')
            return errors
        }
        return errors
    }

    // 扩展
    static validateConfirmPassword (pass1, pass2) {
        let errors = []
        if (typeof pass2 !== 'string') {
            errors.push('"Confirm password" must be a string : "')
            return errors
        }

        if (pass2.length === 0) {
            errors.push('"Confirm password" cannot be empty')
            return errors
        }
        if (pass1 !== pass2){
            errors.push('Inconsistency of passwords entered twice')
            return errors
        }
        return errors
    }

}
