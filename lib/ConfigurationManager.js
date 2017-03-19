let path = require('path')
let fs = require('fs')
let mkdirp = require('mkdirp')
let uuidGenerator = require('uuid')
let prettyjson = require('prettyjson')
let projectConfigurationFilePath = getUserHome() + '/.ssh-manager/projects.json'

function getUserHome () {
	return process.env.HOME || process.env.USERPROFILE
}

let getProjectsConfiguration = function () {
	if (!fs.existsSync(projectConfigurationFilePath)) {
		mkdirp.sync(path.dirname(projectConfigurationFilePath))
		fs.writeFileSync(projectConfigurationFilePath, '[]')
		console.log('Projects configuration file initialized.')
	}

	return require(projectConfigurationFilePath)
}

let saveProjects = function (projects) {
	fs.writeFileSync(projectConfigurationFilePath, JSON.stringify(projects, null, 4))
}

let getProjectWithPropertyValue = function (property, value) {
	let result = null

	projects.forEach((item) => {
		if (item[property] === value) {
			result = item
		}
	})

	return result
}

let projects = getProjectsConfiguration()

let configurationManager = {
	'addProject': function (name, description, user, server) {
		let uuid = uuidGenerator()
		projects.push({
			'uuid': uuid,
			'name': name,
			'description': description,
			'user': user,
			'server': server
		})

		saveProjects(projects)
		console.log('project (' + uuid + ') added')
	},

	'deleteProject': function (uuid) {
		let deletedProjectCount = 0
		let projectsTruncated = []
		projects.forEach((item) => {
			if (item.uuid !== uuid) {
				projectsTruncated.push(item)
			} else {
				deletedProjectCount++
			}
		})

		if (deletedProjectCount !== 0) {
			saveProjects(projectsTruncated)
		}
		console.log('project (' + uuid + ') deleted')
	},

	'showProjects': function () {
		console.log(prettyjson.render(projects, {}))
	},

	'getProjectsList': function () {
		return projects.map((item) => {
			return {
				'name': item.name,
				'value': item.uuid
			}
		})
	},

	'getProject': function (uuid) {
		let project = getProjectWithPropertyValue('uuid', uuid)

		if (project === null) {
			throw new Error('Undefined project with uuid : ' + uuid)
		}

		return project
	}
}

module.exports = configurationManager
