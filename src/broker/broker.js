setTimeout(function(){console.log("Hello docker!")}, 35000)
setTimeout(function(){go()}, 35000)

function go(){
	
	//const createHookReceiver = require('npm-hook-receiver')
	const kafka = require('./kafka')       
	const producer = kafka.producer()      
	const consumer = kafka.consumer({
		groupId: "broker"
	})
	
	var express = require('express') // importa la biblioteca
	var app = express() // crea el servidor
	//const keycloak = require('./config/keycloak-config.js').initKeycloak()
	const session = require('express-session')
	var bodyParser = require ('body-parser')
	//!var testController = require('./controller/test-controller.js
	//app.use(keycloak.middleware())
	var waitingRepsonse =[] 
	
	var i = 0;
	let messageTest = {
		version: 1,
		repository: "https://github.com/isomorphic-git/lightning-fs",
		type: "Simple NPM",
		parameters: "A"
	}

	const memoryStore = new session.MemoryStore()
	app.use(session({
		secret: 'some-secret',
		resave:false,
		saveUninitialized: true,
		store: memoryStore
	} )) 
	

	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser.json());
	app.use(bodyParser.raw());
	app.use(express.json());
	app.use(express.urlencoded());

	app.post('/', function(req, res) {
		var message = JSON.stringify(req.body.message)
		var key = JSON.stringify(req.body.key)
		console.log("receive "+ message + " from " + key)
		waitingRepsonse[key] = res;  
		var resres = waitingRepsonse[key];
		//resres.send("fausse reponse")
		
		const sendK = async (message, key)  => {
			if(!canBeRunned(message)) {
				console.error("Can't be run !! JSON needed")
				return ;
			}  
			console.log("sending to Kafka - "+key + " and "+message)
			
			await producer.connect()
			test = await producer.send({
				topic: "to-run",
				messages: [{
					key: key,
					value: message
				}]
			})
			console.log('Published message n°'+i + " of key: "+key)
		}
		const readK = async (key) => {
			await consumer.connect()
			await consumer.subscribe({
				topic: "result-"+key,
					fromBeginning: true
			})
	
			await consumer.run({
				eachMessage: async ({ topic, partition, message }) => {
					//var key = message.key.toString()
					var key = message.key
					var result = message.value.toString()
					console.log('Received message', {
						topic,
						partition,
						key,
						result
					})
					if(result == undefined){
						result = "/!\\ Error during the execution.../!\\"
					}
					res.send(result)
					consumer.disconnect()
				}
			}) 
		}
		//sendK(JSON.stringify(messageGood),key)
		sendK(message,key)
		readK(key)
		

	}) // respuesta a petición http POST
	
	
	app.listen(3000) // el servidor escucha en el port 3000
	console.log("server on!")

	function canBeRunned(message){
		return message && isJSON(message)
	}

	function isJSON(str) {
		try {
			JSON.parse(str);
		} catch (error) {
			return false;
		}
		return true;
	}

} 