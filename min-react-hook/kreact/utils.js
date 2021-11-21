export const Placement =  0b0010
export const Update = 0b0100
export const Deletion = 0b1000

export function updateNode(node, preProps, props = {}) {
  console.log(preProps)
  Object.keys(preProps).forEach(key => {
    if(key.startsWith('on')) {
      node.removeEventListener(key.slice(2).toLocaleLowerCase(), preProps[key])
    }
  })
  // console.log('update node', node, props)
  Object.keys(props).forEach(key => {
    if(key === 'children') {
      if(typeof props[key] === 'string' || typeof props[key] === 'number') {
        node.textContent = props[key]
      }
    }else if(key.startsWith('on')) {
      node.addEventListener(key.slice(2).toLocaleLowerCase(), props[key])
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
  console.log("a b", a, b)
  return a &&b && a.key === b.key && a.type === b.type
}