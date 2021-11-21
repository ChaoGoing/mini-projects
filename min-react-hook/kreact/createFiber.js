import { Placement } from './utils'

export function createFiber(vnode, returnFiber) {
  // console.log('create fiber', vnode)
  const fiber = {
    type: vnode.type,
    key: vnode.key,
    props: vnode.props,
    
    child: null,
    sibling: null,
    return: returnFiber,
    stateNode: null,

    flags: Placement,

    vnode: vnode

  }
  return fiber
}