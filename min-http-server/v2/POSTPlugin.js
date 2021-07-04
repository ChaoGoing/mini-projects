const fs = require("fs");
const path = require("path");

module.exports = function (message, env) {

  if (message.response.status) {
    return message;
  }

  if (message.request.method !== 'POST') {
    return message;
  }

  if (message.request.path.indexOf('.') === 0) {
    message.response.status = 403;
    return message;
  }

  const requestPath = path.resolve(env.root + message.request.path);

  if (fs.existsSync(requestPath)) {
    message.response.status = 403;
    return message;
  }

  fs.mkdirSync(path.dirname(requestPath), { recursive: true });
  fs.writeFileSync(requestPath, message.request.body);

  message.response.status = 201;
  return message;
}
