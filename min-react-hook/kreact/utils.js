export function updateNode(node, props = {}) {
  // console.log('update node', node, props)
  Object.keys(props).forEach(key => {
    if(key === 'children') {
      if(typeof props[key] === 'string' || typeof props[key] === 'number') {
        node.textContent = props[key]
      }
    }else if(key.startsWith('on')) {
      node.addEventListener('click', props[key])
    }else {
      node[key] = props[key]
    }
  })
}

export function getParentNode(_wip) {
  let temp = _wip
  while(temp) {
    if(temp.stateNode) {
      return temp.stateNode
    }
    temp = _wip.return
  }
}

export function sameNode(a, b) {
  return a &&b && a.key === b.key && a.type === b.type
}