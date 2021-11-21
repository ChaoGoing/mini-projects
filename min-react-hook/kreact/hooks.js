import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop"

let currentlyRendingFiber
let workInProgressHook

export function renderWithHooks(wip) {
  currentlyRendingFiber = wip
  currentlyRendingFiber.memorizedState = null
  workInProgressHook = null
}

function updateWorkInProgressHook() {
  let hook
  let current = currentlyRendingFiber.alternate
  if(current) {
    currentlyRendingFiber.memorizedState = current.memorizedState
    if(workInProgressHook) {
      workInProgressHook = hook = workInProgressHook.next
    } else {
      workInProgressHook = hook = currentlyRendingFiber.memorizedState
    }
  }else { // 第一次渲染hook
    hook = {
      memorizedState: null,
      next: null
    }
    if(workInProgressHook) { 
      workInProgressHook.next = hook
      workInProgressHook = workInProgressHook.next
    }else { // 第一个hook
      workInProgressHook = currentlyRendingFiber.memorizedState = hook
    }
  }
  return hook
}

export function useReducer(reducer, initState) {
  const hook = updateWorkInProgressHook()
  console.log('hook', hook)

  // 初次渲染
  if(!currentlyRendingFiber.alternate) {
    hook.memorizedState = initState
  }

  const dispatch = () => {
    console.log('dispatch')
    hook.memorizedState = reducer(hook.memorizedState)
    console.log("dispath hook", hook)
    scheduleUpdateOnFiber(currentlyRendingFiber)
  }
  return [hook.memorizedState, dispatch]
}