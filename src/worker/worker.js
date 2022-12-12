const fs = require('fs')

const path = require('path')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')

const systemDirection = path.join(process.cwd(), 'framework')

function removeDirectory() {
	console.log('Execute order 66')
	try {
		fs.rmSync(systemDirection, { recursive: true, force: true })
	} catch (error) {
		console.log('The directory cannot be removed')
	}
}

async function workInJob(repository){ 
	await clone(repository)
	runJob()
	removeDirectory(systemDirection)
}

async function clone(repository) {
	await git.clone({
		fs,
		http,
		dir: systemDirection,
		url: repository
	}).then(console.log('Git repository cloned correctly'))
}

function runJob(){
	console.log('Running job')

} 

workInJob('https://github.com/isomorphic-git/lightning-fs')




