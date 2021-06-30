const RequestParser = require('./RequestParser.js')
const makeRespones = require('./makeRespones')

module.exports = (connection) => {
  const parser = new RequestParser();

  connection.on('data', (buffer) => {
    parser.append(buffer);
  });

  parser.on('finish', (message) => {
    console.log("message", message)
    connection.end(makeRespones(message))
  })

}