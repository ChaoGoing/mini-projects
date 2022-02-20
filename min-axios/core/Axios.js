import Interceptor from './InterceptorManager.js'
import util from './utils.js';

class Axios {
  constructor(defaultConfigs) {
    this.defaults = defaultConfigs || {}
    this.interceptors = {
      request: new Interceptor(),
      response: new Interceptor()
    }
  }
  
}

Axios.prototype.request = function(config) {
  const chain = []
  const requestInterceptorChain = []
  const responsetInterceptorChain = []
  return this.defaults.adapter.then((res) => {
    console.log(res.default)
    const req = res.default
    return req && req(config)
  })
};

['delete', 'get', 'head', 'options'].forEach((method) => {
  Axios.prototype[method] = function(url, config = {}) {
    console.log(this)
    return this.request(Object.assign({
      method: method,
      url,
      data: config.data
    }, config))
  }
});


['post', 'put', 'patch'].forEach(method => {
  Axios.prototype[method] = function(url, data = {}, config) {
    return this.request(Object.assign({
      method,
      url,
      data,
    }, config))
  }
})

export default Axios

