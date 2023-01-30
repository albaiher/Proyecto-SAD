setTimeout(function(){console.log("Hello client!")}, 39000)
setTimeout(function(){go()}, 39000)

function go(){

  const axios = require('axios').default;

	var express = require('express') // importa la biblioteca
	var app = express() // crea el servidor
	//const keycloak = require('./config/keycloak-config.js').initKeycloak()
	const session = require('express-session')
	var bodyParser = require ('body-parser')
	//!var testController = require('./controller/test-controller.js
	//app.use(keycloak.middleware())
	
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


let args = process.argv.slice(2)
if (args.length < 1) {
  console.log ("node myclient brokerURL")
  process.exit(-1)
}
let bkURL   = args[0]
console.log(bkURL+ " i'm entry")

  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  app.use(bodyParser.raw());
  app.use(express.json());
  app.use(express.urlencoded());

  
  app.post('/', function(req, res) {
    var message = req.body.message
    var key = req.body.key
    console.log("receive k:"+key+ ", m:"+ message + " from an entrypoint")

    axios.request({
      method: "POST",
      url: bkURL,
      data:{
        key:key,
        message: message
      }
    })
    .then(function (reponse) {
      //On traite la suite une fois la réponse obtenue 
      console.log("reponse:");
      console.log(reponse.data);
      res.send(reponse.data)
    })
    .catch(function (erreur) {
      //On traite ici les erreurs éventuellement survenues
      console.log("Erreur:");
      console.log(erreur);
      res.send(erreur)
    });
  
  
    

  }) // respuesta a petición http POST
    
  
  app.listen(2525) // el servidor escucha en el port 2525
    console.log("server on!")
  
  }


