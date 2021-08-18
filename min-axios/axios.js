import Axios from './core/Axios.js';
import utils from './core/utils.js';
import defaults from './core/defaults.js';

function createInstance(configs) {
  const context = new Axios(configs)
  // const instance = Axios.prototype.requset.bind(context)
  const instance = context.request.bind(context)
  console.log('axios prototype', Axios.prototype)
  utils.extend(instance, Axios.prototype, context)
  utils.extend(instance, context)
  console.dir(instance)
  return instance
}

const axios = createInstance(defaults)
axios.create = function(configs) {
  return createInstance(Object.assign(defaults, configs))
}

export default axios