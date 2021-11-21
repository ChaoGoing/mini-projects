
/**
 * 一些可学习的点：
 * 1.DOM API做一个封装，支持对方法重新定义，提高可扩展性
 * 2.insertedVnodeQueue 做一个深层传递，用于vnode的管理，减少副作用和状态管理的封装
 * 3.
 */

function patchNode(params) {
  // 比较两个Vnode的不同并更新
  
  
}

function updateChildren(params) {
  
}

function toEmptyVnode(params) {
  
}

function sameVnode(params) {
  
}

function isVnode(params) {
  
}




function init() {
 
  
  
  return function patch(oldVnode, newVnode) {

    let elm, parent, i
    //call pre hook  
    
    // 定义一个数组记录生成的vnode, 统一钩子函数的调用
    const insertedVnodeQueue = []

    if(!isVnode(oldVnode)) {
      oldVnode = toEmptyVnode(oldVnode)
    }
   
    if(sameVnode(oldVnode, newVnode)) {
      patchNode(oldVnode, newVnode, insertedVnodeQueue)
    }else {
      elm = oldVnode.elm
      parent = elm && elm.parentNode
      createEle(vnode, insertedVnodeQueue)
      
      if(parent !== null) {
        // remove oldnode

        // insert into parent 

      }

      // call insert hook

    }

    // call post hook
    
    return newVnode
  }
}