setTimeout(function(){console.log("Hello client!")}, 40000)
setTimeout(function(){go()}, 40000)
function go(  ) {   

  const axios = require('axios').default;
  const FormData = require('form-data')

  var mesDonnees = new FormData();
  mesDonnees.append("prenom", "Alfred");
 

  let args = process.argv.slice(2)
  if (args.length < 1) {
    console.log ("node myclient brokerURL")
    process.exit(-1)
  }
  let bkURL   = args[0]
  console.log(bkURL+ " i'm client")

  axios.request({
    method: "POST",
    url: bkURL,
    //data: mesDonnees
    //data: '{"user":"mathilde"}'
    data:{
      key:5,
      url:"http://github.com"
    }
  })
  .then(function (reponse) {
    //On traite la suite une fois la réponse obtenue 
    console.log("reponse:");
    console.log(reponse.data);
  })
  .catch(function (erreur) {
    //On traite ici les erreurs éventuellement survenues
    console.log("Erreur:");
    console.log(erreur);
  });
}
