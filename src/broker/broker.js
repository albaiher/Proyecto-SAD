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

	const main= async() =>{
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

		var stop = false
		app.post('/', function(req, res) {
			var url = JSON.stringify(req.body.url)
			var key = JSON.stringify(req.body.key)
			console.log("receive "+ url + " from " + key)
			waitingRepsonse[key] = res;  
			var resres = waitingRepsonse[key];
			//resres.send("fausse reponse")
			
			const send = async (link, key)  => {
				console.log("sending to Kafka - "+key + " and "+link)
				
				await producer.connect()
				test = await producer.send({
					topic: "to-run",
					messages: [{
						key: key,
						value: JSON.stringify({
							link: link
						})
					}]
				})
				console.log('Published message n°'+i + " of key: "+key)
			}
			const read = async (key) => {
				await consumer.connect()
				await consumer.subscribe({
					topic: "result-"+key,
					   fromBeginning: false
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
					   res.send(result)
					}
				}) 
			}
			send(url,key)
			read(key)
			

		}) // respuesta a petición http POST
   		
		
		app.listen(3000) // el servidor escucha en el port 3000
    	console.log("server on!")

	} 

	main()
	
	.catch(error => {
	console.error(error)
	process.exit(1)
	})

}


