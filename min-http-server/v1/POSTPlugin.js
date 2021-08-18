const fs = require('fs')
const path = require('path')
const helper = require('./helper')

module.exports = function(message, env) {
  helper.setHeader(message.response.headers, 'Access-Control-Allow-Origin', '*')
  // helper.setHeader(message.response.headers, 'Access-Control-A')
  helper.setHeader(message.response.headers, 'Access-Control-Allow-Headers', 'Content-Type');
  helper.setHeader(message.response.headers, 'Access-Control-Allow-Methods', '*');

  if(!message.status) return message
  if(message.request.method !== 'POST') return message
  if(message.request.path.indexOf('.') === 0) {
    message.response.status = 403
    return message
  }
  const requestPath = path.resolve(env.root + message.request.path)
  if(fs.existsSync(requestPath)) {f
    message.response.status = 403
    return message
  }
  fs.mkdirSync(path.dirname(requestPath), {recursive: true})
  fs.writeFileSync(requestPath, message.request.body)
  message.response.status = 201;
  return message
}