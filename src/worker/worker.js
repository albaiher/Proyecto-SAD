const { executionAsyncResource } = require('async_hooks')

setTimeout(function(){console.log("Hello worker!")}, 50000)
setTimeout(function(){go()}, 50000)

function go(){

	const kafka = require('./kafka')   
	const consumer = kafka.consumer({
		groupId: "worker"
	})
	const producer = kafka.producer() 

	const fs = require('fs')

	const path = require('path')
	const git = require('isomorphic-git')
	const http = require('isomorphic-git/http/node')
	
	const systemDirection = path.join(process.cwd(), 'framework')
	
	
	var i = 0;

	function execute(){
		while(working) {}
		console.log("Starting work") 
		workInJob(toDo.pop())
	}

	const readKafka = async () => {
		await consumer.connect()
		await consumer.subscribe({
			topic: "to-run",
		   	fromBeginning: true
		})

		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
			   console.log('Received message', {
				  topic,
				  key: message.key.toString(),
				  value: message.value.toString()
			   })
			   workInJob('https://github.com/isomorphic-git/lightning-fs', message.key.toString())
			   
			}
		}) 
	}
	
	var result = 156455;
	async function sendResult  (result, key)  {
		await producer.connect()
		await producer.send({
			topic: "result",
			messages: [{
				key: key,
				value: JSON.stringify(15645),
			}]
		})
	}
	
	async function removeDirectory() {
		console.log('Execute order 66')
		try{
			fs.rmSync(systemDirection, { recursive: true, force: true })
		}
		catch (error ) { 
			console.log('The directory cannot be removed')	
		}
	}	
	async function workInJob(repository, key){ 
		clone(repository)
		result = runJob()
		removeDirectory(systemDirection)
		sendResult(result, key);
	}

	async function clone(repository) {
		i++
		await git.clone({
			fs,
			http,
			dir: systemDirection.concat(i),
			url: repository
		}).then(console.log('Git repository cloned correctly'))
	}

	async function runJob(){
		console.log('Running job')
		return 324232;

	}
	function timeTest(){
		setTimeout(()=>{console.log("Fin du timeout")}, 20000)
	} 

	//workInJob('https://github.com/isomorphic-git/lightning-fs')
	
	readKafka();
	
	
	module.exports = {workInJob} 
}

