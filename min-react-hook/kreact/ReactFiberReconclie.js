import { createFiber } from "./createFiber"
import { renderWithHooks } from "./hooks"
import { updateNode } from "./utils"

export function updateHostComponent(wip) {
  if(!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type)
    updateNode(wip.stateNode, wip.props)
  }
  reconcileChildren(wip, wip.props.children)
}

export function updateFuncComponent(wip) {
  renderWithHooks(wip)
  const { type, props } = wip
  const children = type(props)
  console.log("C",children)
  reconcileChildren(wip, children)
}

function reconcileChildren(returnFiber, children) {
  if(typeof children === 'string' || typeof children === 'number') {
    return
  }
  const newChildren = Array.isArray(children) ? children : [children]
  let prevFiber
  for(let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i]
    const newFiber = createFiber(newChild, returnFiber)
    // console.log("pre", prevFiber)
    if(i === 0) {
      returnFiber.child = newFiber
    }else {
      prevFiber.sibling = newFiber
    }
    prevFiber = newFiber
  }

}