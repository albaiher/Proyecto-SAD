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

setTimeout(function(){console.log("Hello worker!")}, 38000)
setTimeout(function(){initialize()}, 38000)

var i = 0;

function initialize(){

	consumer = kafka.consumer({ groupId: "worker" })
	producer = kafka.producer()

	const readKafka = async () => {
		await consumer.connect()
		await consumer.subscribe({
			topic: "to-run",
		   	fromBeginning: false
		})

		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				var key = message.key
				let json = JSON.parse(message.value.toString())
			
			   console.log("//!!\\\/Executing message with key: "+key+" and url: "+json)
			   i++;
			   //sendResult(" Holaaa, "+key+", encantado de conocerte", key )
			   

			   workInJob(message.key, json)
			}
		}) 
	}

	readKafka();
}

async function workInJob(key, job){
	if(isWorking()) return ;
	let result
	try{
		await clone(job.repository)
		result = await runJob(job.type, job.parameters)
		.then(sendResult(result, key))
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

async function runJob(type, parameters){
	console.log(`Running job type ${type}`)
	let stdout

	if (isASimpleNPM(type)){
		stdout = runCommandSync("npm start", systemDirection)
	} else if(isAnotherType(type)){
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
	if(result == undefined){
		result = "/!\\ Error during the execution.../!\\"
	}
	console.log(result)
	console.log("\n\n")
	console.log(JSON.stringify(result))

	await producer.connect()
	await producer.send({
		topic: "result-"+key,
		messages: [{
			key: key,
			value: JSON.stringify(result),
		}]
	})
	console.log("Sending to "+key)
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

function isASimpleNPM(type) {
	return type === "Simple npm" 
}

function isAnotherType(type) {
	return type === "Another Type"
}


function testWorker(){
	let message = {
		version: 1,
		repository: "https://github.com/isomorphic-git/lightning-fs",
		type: "Simple npm",
		parameters: "A"
	}
	workInJob("Key", message)
}

