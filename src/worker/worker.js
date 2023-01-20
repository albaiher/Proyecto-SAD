setTimeout(function(){console.log("Hello worker!")}, 45000)
setTimeout(function(){go()}, 45000)

function go(){

	const kafka = require('./kafka')   
	const consumer = kafka.consumer({
		groupId: "worker"
	 })

	const fs = require('fs')

	const path = require('path')
	const git = require('isomorphic-git')
	const http = require('isomorphic-git/http/node')

	const systemDirection = path.join(process.cwd(), 'framework')

	const main = async () => {
		await consumer.connect()
		await consumer.subscribe({
			topic: "test-projet",
		   	fromBeginning: true
		})

		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
			   console.log('Received message', {
				  topic,
				  partition,
				  key: message.key.toString(),
				  value: message.value.toString()
			   })
			}
		}) 
	}	
	main();

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

	module.exports = {workInJob} 
}


