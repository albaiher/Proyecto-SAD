//const zmq = require('zeromq')
const path = require('path')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')
const fs = require('fs')

/*
let req = zmq.socket('req')
req.identity = 'Worker1'
var args = process.argv.slice(2)
if (args.length < 1) {
  console.log ("node myclient brokerURL")
  process.exit(-1)
}
var bkURL   = args[0]
console.log(bkURL+"i'm worker")
req.connect(bkURL)
req.on('message', (c,sep,msg)=> {
	console.log("received",c+'',msg+'')
	setTimeout(()=> {
		req.send([c,'','resp'])
	}, 1000)
})
req.send(['','',''])
*/
async function workInJob(){ 
	const dir = path.join(process.cwd(), 'workDir')
	await git.clone({ 
		fs, 
		http, 
		dir, 
		url: 'https://github.com/isomorphic-git/lightning-fs' 
	}).then(console.log('Git repository cloned correctly'))

	console.log('Execute order 66')
	fs.rmSync(dir, { recursive: true, force: true });
}

workInJob()


