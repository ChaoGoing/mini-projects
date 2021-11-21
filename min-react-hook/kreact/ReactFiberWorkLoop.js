import { updateFuncComponent, updateHostComponent } from "./ReactFiberReconclie"
import { getParentNode } from "./utils"

let wipRoot = null
let wip = null

export function scheduleUpdateOnFiber(fiber) {
  fiber.alternate = { ...fiber }
  wipRoot = fiber
  wip = fiber
  requestIdleCallback(workloop)
}

function perfomUnitOfWork() {
  // 处理当前任务
  console.log("111", wip)
  const { type } = wip
  if(typeof type === 'string' || typeof type === 'number') {
    updateHostComponent(wip)
  }else if(typeof type === 'function'){
    updateFuncComponent(wip)
  }

  // 深度优先遍历,, 写法和执行顺序值得回味
  if(wip.child) {
    wip = wip.child
    return 
  }

  let next = wip
  while(next) {
    if(next.sibling) {
      wip = next.sibling
      return
    }
    next = next.return
  }

  wip = null
}

function workloop(IdleDeadline) {
  while(wip && IdleDeadline.timeRemaining() > 0) {
    // console.log("rendering", wip)
    perfomUnitOfWork() // 这里不需要传入wip，否则wip = null 改变的是局部变量的wip
    requestIdleCallback(workloop)

  }
  console.log("wipRoot", wipRoot)

  if(!wip && wipRoot) {
    // console.log('commit root')
    commitRoot(wipRoot)
  }
}

function commitRoot(params) {
  commitWorker(wipRoot)
  wipRoot = null
}

function commitWorker(_wip) {
  if(!_wip) {
    return
  }
  // console.log("commit", _wip)
  const { flags, stateNode } = _wip
  let parentNode = getParentNode(_wip.return)
  // console.log("parne", parentNode, _wip)
  if(stateNode) {
    parentNode.appendChild(stateNode)
  }
  commitWorker(_wip.child)
  commitWorker(_wip.sibling)
}

// requestIdleCallback(workloop)
