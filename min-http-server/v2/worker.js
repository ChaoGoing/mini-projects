const RequestParser = require('./RequestParser');
const makeResponse = require('./makeResponse');
const path = require('path');

const POSTPlugin = require('./POSTPlugin');
const GETPlugin = require('./GETPlugin');
const PUTPlugin = require('./PUTPlugin');
const DELETEPlugin = require('./DELETEPlugin');
const AuthPlugin = require('./AuthPlugin');
const CORSPlugin = require('./CORSPlugin');
const OPTIONSPlugin = require('./OPTIONSPlugin');

module.exports = (connection) => {

  const parser = new RequestParser();
  const env = {
    root: path.resolve(__dirname, './www'),
    session: path.resolve(__dirname, './session')
  }

  connection.on('data', (buffer) => {
    parser.append(buffer);
  });

  parser.on('finish', (message) => {

    message = CORSPlugin(message, env);
    message = OPTIONSPlugin(message, env)

    message = AuthPlugin(message, env)
    // plugin 0
    message = POSTPlugin(message, env);
    message = GETPlugin(message, env);
    message = PUTPlugin(message, env);
    message = DELETEPlugin(message, env);
    // make reqsonse
    connection.end(makeResponse(message));
  })
}
