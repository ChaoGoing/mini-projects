import { createFiber  } from './createFiber.js'
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop.js'


function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot 
}

ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot
  updateContainer(children, root)
}

function createRoot(container) {
  
  const root = {
    containerInfo: container
  }

  return new ReactDOMRoot(root)
}

function updateContainer(element, root) {
  const { containerInfo } = root
  const fiber = createFiber(element, {
    type: containerInfo.nodeName.toLocaleLowerCase(),
    stateNode: containerInfo
  })
  
  scheduleUpdateOnFiber(fiber)

}

export {
  createRoot
}