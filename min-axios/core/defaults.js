import utils from './utils.js'

function getDefaultAdapter() {

  let adapter
  if(typeof XMLHttpRequest !== undefined) {
    adapter = import('../adapters/xhr.js')
    
  }else if(process !== undefined && utils.type(process) === 'Process') {
    // todo
  }

  return adapter
}

export default {
  adapter: getDefaultAdapter()
}