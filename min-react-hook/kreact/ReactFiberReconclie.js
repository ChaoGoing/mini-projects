import { createFiber } from "./createFiber"
import { renderWithHooks } from "./hooks"
import { sameNode, updateNode, Update } from "./utils"

export function updateHostComponent(wip) {
  if(!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type)
    updateNode(wip.stateNode,{}, wip.props)
  }
  reconcileChildren(wip, wip.props.children)
}

export function updateFuncComponent(wip) {
  renderWithHooks(wip)
  const { type, props } = wip
  const children = type(props)
  // console.log("C",children)
  reconcileChildren(wip, children)
}

function reconcileChildren(returnFiber, children) {
  if(typeof children === 'string' || typeof children === 'number') {
    return
  }
  const newChildren = Array.isArray(children) ? children : [children]
  let oldFiber = returnFiber.alternate && returnFiber.alternate.child
  let prevFiber
  for(let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i]
    const newFiber = createFiber(newChild, returnFiber)
    const same = sameNode(newFiber, oldFiber)
    console.log("is same", same)

    if(same) {
      Object.assign(newFiber, {
        alternate: oldFiber,
        stateNode: oldFiber.stateNode,
        flags: Update
      })
    }

    if(oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if(i === 0) {
      returnFiber.child = newFiber
    }else {
      prevFiber.sibling = newFiber
    }
    prevFiber = newFiber
  }

}