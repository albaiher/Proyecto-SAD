const zmq = require('zeromq')
let req = zmq.socket('req');

let args = process.argv.slice(2)
if (args.length < 1) {
  console.log ("node myclient brokerURL")
  process.exit(-1)
}
let bkURL   = args[0]
let quedan=10
console.log(bkURL+ "i'm client")
req.connect(bkURL)
req.on('message', (msg)=> {
	console.log('i respond: '+msg)
	if (--quedan==0) process.exit(0);
})
for (let i=0; i<10; i++) req.send('Hola')
