const kafka = require('./kafka')
const  path = require('path')
const git = require('isomorphic-git')
const http  = require('isomorphic-git/http/node')
const  fs = require('fs')
const cmd = require('child_process');

let systemDirection = path.join(process.cwd(), 'framework-')
let safeDirectory = 1
var consumer, producer
var alreadyWorking = false

//setTimeout(function(){console.log("Hello worker!")}, 50000)
//setTimeout(function(){initialize()}, 50000)

function initialize(){

	consumer = kafka.consumer({ groupId: "worker" })
	producer = kafka.producer()

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
			   workInJob(message.key.toString(), message.value.toString())
			}
		}) 
	}

	readKafka();
}

async function workInJob(repository, execParameters){
	if(isWorking()) return ;
	let parameters = JSON.parse(execParameters)
	await clone(repository)
	let result = await runJob(execParameters)
	removeDirectory(systemDirection)
	//sendResult(result, execParameters)
}

async function clone(repository) {
	alreadyWorking = true
	systemDirection = systemDirection.concat(safeDirectory);

	await git.clone({
		fs,
		http,
		dir: systemDirection,
		url: repository
	}).then(() => {
		console.log('Git repository cloned correctly')
		safeDirectory++
	})
	
}

async function runJob(parameters){
	console.log('Running job')
	let stdout

	if (isASimpleNPM(parameters)){
		stdout = runCommandSync("npm start", systemDirection)
	} else if(isAnotherType(parameters)){
		runCommandSync("cat README.md", systemDirection)
	}
	
	return stdout;
}

function isAnotherType(parameters) {
return "A".equal("Another Type")
}

function isASimpleNPM(parameters) {
return "B".equal("Simple npm")
}

async function removeDirectory(directory) {
	console.log('Execute order 66')
	try{
		fs.rmSync(directory, { recursive: true, force: true })
	}
	catch (error ) { 
		console.log('The directory cannot be removed')	
	}
}	

async function sendResult  (result, key)  {
	alreadyWorking = false

	await producer.connect()
	await producer.send({
		topic: "result",
		messages: [{
			key: key,
			value: JSON.stringify(result),
		}]
	})
}

function isWorking() {
	return alreadyWorking
}

function runCommandSync(command, directory) {
	let buffer
	try {
		buffer = cmd.execSync(command, {cwd: directory ,encoding: 'utf-8'})
	} catch (error) {
		console.log(error)
	}
	return buffer
}

workInJob('https://github.com/isomorphic-git/lightning-fs', 1)

