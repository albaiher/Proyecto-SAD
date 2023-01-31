
setTimeout(function(){console.log("Hello entry!")}, 40000)
setTimeout(function(){go()}, 40000)
function go(  ) {   

  const axios = require('axios').default;
 

  let args = process.argv.slice(2)
  if (args.length < 1) {
    console.log ("node myenrty clientURL")
    process.exit(-1)
  }
  let ckURL   = args[0]
  console.log(ckURL+ " i'm entry")

  axios.request({
    method: "GET",
    url: ckURL.concat("/authorization"),
    data:{
      username: "albaiher",
      password: "LPKGs8YMThUqHDs"
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

