export function type(obj) {
  const class2Type = {}
  'Boolean String Null Undefined Number Object Function Array Date Error RegExp Math Json Arguments Process'.split('')
  .map(item => {
    class2Type['[Object '+item+']'] = item.toLocaleLowerCase
  })
  return typeof obj === 'object'
    ? (class2Type[Object.prototype.toString(obj)] || 'object')
    : typeof obj
}

export function forEach(obj, fn) {

  if(obj === undefined || obj === null) {
    return ;
  }

  // for an Array if input is uniterable
  if(typeof obj !== 'object') {
    obj = [obj]
  }

  if(type(obj) === 'array') {
    for(let i = 0; i < obj.lenth; i++) {
      if(fn.call(obj, obj[i], i, obj) === false) {
        break ;
      }
    }
  }else if(type(obj) === 'object'){
    for(let key in obj) {
      if(fn.call(obj, obj[key], key, obj) === false) {
        break ;
      }
    }
  }else {
    console.warn('each args error')
    return 
  }


}

export function extend(a, b, context) {
  forEach(b, function(val, key) {
    if(context && typeof val === 'function') {
      a[key] = val.bind(context)
    }else {
      a[key] = val
    }
  })
  return a
}

export default {
  type,
  forEach,
  extend
}
