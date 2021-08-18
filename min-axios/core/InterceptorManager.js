import utils from './utils.js';

export default class Interceptor{
  constructor() {
    this.handler = []
  }

  use(fn) {
    this.handler.push((fullfilled, failed, options) => {
      this.handler.push({
        fullfilled,
        failed
      })
    })
  }

  forEach(fn) {
    utils.forEach(this.handler, function (h) {
      fn && fn(h)
    })
  }
}


