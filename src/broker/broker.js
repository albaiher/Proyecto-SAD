setTimeout(function(){console.log("Hello docker!")}, 50000)
setTimeout(function(){go()}, 50000)

function go(){

	const createHookReceiver = require('npm-hook-receiver')
	const kafka = require('./kafka')       
	const producer = kafka.producer()      
	const consumer = kafka.consumer({
		groupId: "broker"
	 })


	const main = async () => {            
		const server = createHookReceiver({
			// Secret created when registering the webhook with NPM.
			// Used to validate the payload.
			secret: 'super-secret-string',
			// Path for the handler to be mounted on.
			mount: '/hook'
		})

		server.listen(process.env.PORT || 3000, () => {
			console.log(`Server listening on port ${process.env.PORT || 3000}`)
		})
	}

	const readKafka = async () => {
		await consumer.connect()
		await consumer.subscribe({
			topic: "result",
		   	fromBeginning: true
		})

		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
			   console.log('Received message', {
				  topic,
				  partition,
				  key: message.key.toString(),
				  result: message.value.toString()
			   })
			}
		}) 
	}
	var i = 0;
	async function sendKafka  (message)  {
		if(canBeRunned()) return ;
		console.log("send Kafka"+i)
		
		await producer.connect()
		test = await producer.send({
			topic: "to-run",
			messages: [{
				key: "key".concat(i++),
				value: message
			}]
		})
		console.log('Published message'+i, { test })
		}
	readKafka();
	main()
	.then( () => {
		let message = {
			version: 1,
			repository: "https://github.com/isomorphic-git/lightning-fs",
			type: "Simple NPM",
			parameters: "A"
		}
		sendKafka(JSON.stringify(message))
	})
	.catch(error => {
	console.error(error)
	process.exit(1)
	})

}

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

/*const main = async () => {
   await producer.connect()             // ++
   const server = createHookReceiver({
      // Secret created when registering the webhook with NPM.
      // Used to validate the payload.
      secret: process.env.HOOK_SECRET,
      // Path for the handler to be mounted on.
      mount: '/hook'
   })

   server.on('package:publish', async event => {
	try {
	   const responses = await producer.send({
		  topic: process.env.TOPIC,
		  messages: [{
			 // Name of the published package as key, to make sure that we process events in order
			 key: event.name,
			 // The message value is just bytes to Kafka, so we need to serialize our JavaScript
			 // object to a JSON string. Other serialization methods like Avro are available.
			 value: JSON.stringify({
				package: event.name,
				version: event.version
			 })
		  }]
	   })
	   console.log('Published message', { responses })
	} catch (error) {
	   console.error('Error publishing message', error)
	}
	})
   server.listen(process.env.PORT || 3000, () => {
      console.log(`Server listening on port ${process.env.PORT || 3000}`)
   })
}

main().catch(error => {
   console.error(error)
   process.exit(1)
})
*/