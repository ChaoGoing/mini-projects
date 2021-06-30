const net = require('net');
const worker = require('./worker')

net.createServer((connection) => {
  console.log('new connection')
  worker(connection)
}).listen(8080)