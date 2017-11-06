let inquirer = require('inquirer')
let colors = require('../../app/colors-custom')
let prompt = inquirer.createPromptModule()
let cm = require('../../app/configuration-manager')

module.exports = class SubCommand {
    static async _selectConnectionConfiguration () {
        let allConnectionConfigurationChoices = cm.getConnectionConfigurationList()

        if (allConnectionConfigurationChoices.length === 0) {
            console.log(colors.error(new Error('no connection configuration found into "' + cm.ccfp + '". Please use "config" command.')))
            process.exit(1)
        }

        let selectConnectionConfigurationInquirer = {
            type: 'list',
            message: 'Select an connection',
            name: 'uuid',
            choices: allConnectionConfigurationChoices
        }

        let result = await prompt(selectConnectionConfigurationInquirer)
        let selectedConnectionConfiguration = null

        try {
            selectedConnectionConfiguration = cm.getConnectionConfiguration(result.uuid)
        } catch (e) {
            process.exit(1)
        }

        return selectedConnectionConfiguration
    }
}
