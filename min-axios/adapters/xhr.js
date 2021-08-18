

export default function(config) {
  return new Promise((resolve, reject) => {
    const { method, url, data } = config
    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(),  url, true)
    if('onloadend' in request) {

      const response = {

      }

      request.onloadend = function() {
        resolve(request.response)
      }
      request.send(data)
    }

  })
}