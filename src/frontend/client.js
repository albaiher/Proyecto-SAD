const axios = require('axios').default;
var express = require('express') 
let kC_Builder = require('./config/keycloak-config.js')
var bodyParser = require ('body-parser')
const session = require('express-session')
let app

setTimeout(function(){console.log("Hello client!")}, 39000)
setTimeout(function(){initialize()}, 39000)

function initialize(){
  let args = process.argv.slice(2)
  if (args.length < 1) {
    console.log ("node myclient brokerURL")
    process.exit(-1)
  }
  let bkURL = args[0]

	app = express()
	const memoryStore = new session.MemoryStore()
  app.use(session(
    {
    secret: 'some-secret',
    resave:false,
    saveUninitialized: true,
    store: memoryStore
    }
  )) 
  let kc = kC_Builder.initKeycloak(memoryStore)
	app.use(kc.middleware())

  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  app.use(bodyParser.raw());
  app.use(express.json());
  app.use(express.urlencoded());

  let keycloak = kC_Builder.getKeycloak()
  app.post('/JS', keycloak.protect('manager','usuario'), function(req, res) {
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
      console.log("reponse:");
      console.log(reponse.data);
      res.send(reponse.data)
    })
    .catch(function (erreur) {
      console.log("Erreur:");
      console.log(erreur);
      res.send(erreur)
    })
  })
  
    app.post('/NPM', keycloak.protect('manager'), function(req, res) {
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
        console.log("reponse:");
        console.log(reponse.data);
        res.send(reponse.data)
      })
      .catch(function (erreur) {
        console.log("Erreur:");
        console.log(erreur);
        res.send(erreur)
      })
    })

    app.get("/authorization", async function(req, res){
      
      return await axios.post(
        'http://keycloak:8080/realms/SAD/protocol/openid-connect/token',
        new URLSearchParams({
            'client_id': 'proyecto-sad',
            'username': req.body.message.username,
            'password': req.body.message.password,
            'grant_type': 'password',
            'client_secret': 'vUsOFcBzj0wB2mZ8GhtbzDwMW33dce9L'
        })
      ).then(response => {
          // Return token here
          return (response)?.access_token
        }).catch( error =>
          {
            return error
          })
    })

  app.listen(2525) // el servidor escucha en el port 2525
  console.log("server on!")
}