const zmq = require('zeromq')
let sc = zmq.socket('router') // frontend
let sw = zmq.socket('router') // backend

var args = process.argv.slice(2)
if (args.length < 2) {
  console.log ("node mybroker clientsPort workersPort")
  process.exit(-1)
}

var cport = "9998"
var wport = "9999"
let cli=[], req=[], workers=[]
sc.bind('tcp://*:'+cport)
sw.bind('tcp://*:'+wport)
sc.on('message',(c,sep,m)=> {
	console.log('client msg',c+'',m+'')
	if (workers.length==0) { 
		cli.push(c); req.push(m)
	} else {
		sw.send([workers.shift(),'',c,'',m])
	}
})
sw.on('message',(w,sep,c,sep2,r)=> {
    console.log('worker msg',w+'',c+'',r+'')
    if (c!='') sc.send([c,'',r])
    if (cli.length>0) { 
	sw.send([w,'',
	    cli.shift(),'',req.shift()])
    } else {
	workers.push(w)
    }	
})
