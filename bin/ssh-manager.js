#!/usr/bin/env node

let program = require('commander')
let colors = require('colors')
let inquirer = require('inquirer')
let prompt = inquirer.createPromptModule()
let configurationManager = require('../lib/ConfigurationManager.js')

colors.setTheme({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'grey',
	info: 'white',
	success: 'green',
	data: 'grey',
	help: 'cyan',
	warn: 'yellow',
	debug: 'blue',
	error: 'red'
})

function startSSH (user, server) {
	console.log('ssh ' + user + '@' + server)
}

async function getProjectProperty (message, name) {
	let inputNameInquirer = {
		type: 'input',
		message: message,
		name: name
	}

	let property = await prompt(inputNameInquirer)

	return property[name]
}

async function selectProject () {
	let allProjectName = configurationManager.getProjectsList()

	if (allProjectName.length === 0) {
		console.log(colors.error(new Error('no project found into projects.json. Please use "add" command.')))
		process.exit()
	}

	let selectProjectInquirer = {
		type: 'list',
		message: 'Select an project',
		name: 'uuid',
		choices: allProjectName
	}

	let result = await prompt(selectProjectInquirer)

	let selectedProject = null
	try {
		selectedProject = configurationManager.getProject(result.uuid)
	} catch (e) {
		console.log(colors.error(e))
		process.exit()
	}

	return selectedProject
}

program
	.version('1.0.0')
	.description('A SSH manager to store a list of project connection configuration')

program
	.command('show')
	.description('show all projects SSH configurations')
	.action(() => {
		configurationManager.showProjects()
	})

program
	.command('delete')
	.description('delete an project SSH configuration')
	.action(async () => {
		let projectConfiguration = await selectProject()
		configurationManager.deleteProject(projectConfiguration.uuid)
	})

program
	.command('add')
	.description('add a new project SSH configuration')
	.action(async () => {
		let name = await getProjectProperty('Project name', 'name')
		let description = await getProjectProperty('Description', 'description')
		let user = await getProjectProperty('User', 'user')
		let server = await getProjectProperty('Server', 'server')

		configurationManager.addProject(name, description, user, server)
	})

program
	.command('connect')
	.description('show SSH connection command line')
	.action(async () => {
		let projectConfiguration = await selectProject()
		startSSH(projectConfiguration.user, projectConfiguration.server)
	})

program.parse(process.argv)
