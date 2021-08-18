const RequestParser = require('./RequestParser.js')
const makeRespones = require('./makeRespones')
const POSTPlugin = require('./POSTPlugin');
const GETPlugin = require('./GETPlugin');
const path = require('path')

module.exports = (connection) => {
  const parser = new RequestParser();

  connection.on('data', (buffer) => {
    parser.append(buffer);
  });

  parser.on('finish', (message) => {
    // console.log("message", message)
    const env = {
      root: path.resolve(__dirname, './www'),
      session: path.resolve(__dirname, './session')
    }
    message = GETPlugin(message, env);
    message = POSTPlugin(message, env)
    connection.end(makeRespones(message))
  })

}