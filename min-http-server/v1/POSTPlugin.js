const path = require('path')

module.exports = function(message, env) => {
  if(!message.status) return message
  if(message.request.method !== 'POST') return message
  if(message.request.path.indexOf('.') === 0) {
    message.response.status = 403
    return message
  }
}