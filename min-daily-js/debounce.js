// 基础实现
function debounce_base(callback, options) {
  let timer
  return function(...arguments) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // 改变this的指向为debounce返回的函数的this，
      // addEventListener会把传入的cb(即debounce返回的函数)的this改为当前dom
      callback.apply(this, arguments)
      clearTimeout(timer)
      timer = null
    }, options.wait)
  }
}

// 升级版（立刻执行，可取消）
// 要点： 1.cacel绑定在返回的函数上
// 2.通过timer的有无  
function debounce(callback, options = {}) {
  let timer 
  const _decounce = function (...arguments) {
    if(timer) {
      clearTimeout(timer)
    }
    if(options.immediate) {
      const callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, options.wait)
      if(callNow) {
        callback.apply(this, arguments)
      }
    }else {
      timer = setTimeout(() => {
        callback.apply(this, arguments)
      }, options.wait)
    }
    return () => {
      clearTimeout(timer) 
    }
  }
  _decounce.cancel = function () {
    clearTimeout(timer)
    timer = null
  }
  return _decounce
}