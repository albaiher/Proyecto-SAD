const kafka = require('./kafka')
const  path = require('path')
const git = require('isomorphic-git')
const http  = require('isomorphic-git/http/node')
const  fs = require('fs')
const cmd = require('child_process');
const { Console } = require('console')

let systemDirection = path.join(process.cwd(), 'framework-')
let safeDirectory = 1
var consumer, producer
var alreadyWorking = false

setTimeout(function(){console.log("Hello worker!")}, 50000)
setTimeout(function(){initialize()}, 50000)

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

async function workInJob(repository, message){
	if(isWorking()) return ;
	let result, parameters
	try{
		await clone(repository)
		parameters = JSON.parse(message)
		result = await runJob(message)
		sendResult(result, message)
	} catch (error){
		console.log(error)
	}
	removeDirectory(systemDirection)
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
		stdout = runCommandSync("cat README.md", systemDirection)
	}
	return stdout;
}

function runCommandSync(command, directory) {
	let buffer
	try {
		buffer = cmd.execSync(command, {cwd: directory ,encoding: 'utf-8'})
	} catch (error) {
		throw new Error(`El proyecto ubicado en ${directory}, no es capaz de ejecutar el comando ${command} correctamente. El traza del error es: ${error}`);
	}
	return buffer
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


async function removeDirectory(directory) {
	console.log('Execute order 66')
	try{
		fs.rmSync(directory, { recursive: true, force: true })
	}
	catch (error) { 
		console.log('The directory cannot be removed')	
	}
}

function isWorking() {
	return alreadyWorking
}

function isASimpleNPM(parameters) {
	return "Simple npm" === "Simple npm" 
}

function isAnotherType(parameters) {
	return "Another Type" === "Another Type"
}

workInJob('https://github.com/isomorphic-git/lightning-fs', 1)

