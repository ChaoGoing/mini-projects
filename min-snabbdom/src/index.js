
/**
 * 一些可学习的点：
 * 1.DOM API做一个封装，支持对方法重新定义，提高可扩展性
 * 2.insertedVnodeQueue 做一个深层传递，用于vnode的管理，减少副作用和状态管理的封装
 * 3.将选择器或者空的参数也转换成vnode，方便复用/递归
 * 4.
 */

import { vnode } from "./vnode"

function addNodes() {|

}

function updateChildren(params) {
  
}

function removeVnodes() {

}

function toEmptyVnode(ele) {
  if(!ele) {
    return vnode('div',{}, [])
  }
  const id = ele.id ? '#' + ele.id : ''
  const c = ele.className ? '.' + ele.className.split(' ').join('.') : ''
  return vnode(ele.tagName + id + c, {}, [], undefined, ele)
}

function sameVnode(newVnode, oldVnode) {
  return newVnode.key === oldVnode.key && newVnode.sel === oldVnode.sel
}

function isVnode(params) {
  
}

function createEle(vnode, insertedVnodeQueue) {
  let i, data = vnode.data

  // 触发init钩子
  if(data !== undefined) {
    const init = data.hook.init
    if(init) {
      init(vnode)
      data = vnode.data
    }
  }

  // 渲染真实dom
  let children = vnode.children, sel = vnode.sel
  if(sel === '!') {
    // 注释节点
    document.createComment(vnode.text || '')
  }else if(sel !== undefined) {
    // 解析sel中的id和class选择器
    const hashIdx = vnode.sel.indexOf('#') || 0
    const dotIdx = vnode.sel.indexOf('.') || 0

    // 截取tag名称
    const tag = vnode.sel.slice(Math.min(hashIdx, dotIdx) || 0)

    // 执行module create钩子

    const options ={

    }
    // 
    const elm = document.createElement(tag)

    // 处理子节点
    if(Array.isArray(vnode.children)) {
      for(let i = 0; i < vnode.children.length; i++) {
        const ch = vnode.children[i]
        if(ch !== null) {
          elm.appendChild(createEle(ch, insertedVnodeQueue))
        }
      }
    }else if(typeof vnode.text === 'string' || typeof vnode.text === 'number'){
      elm.appendChild(document.createTextNode(vnode.text))
    }

    // 触发自身的create钩子

    insertedVnodeQueue.push(vnode)

  }else {
    // 空节点
    vnode.elm = document.createTextNode(vnode.text)
  }





}

export const cbs = {
  pre: []
}

function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
  // 比较两个Vnode的不同并更新
  
  // call data.hook prepatch


  const elm = vnode.elm = oldVnode.elm
  const oldCh = oldVnode.children
  constch = vnode.children
  if(oldVnode === vnode) return
  if(vnode.data) {
    // call cbs update
    // call data.hook update
  }

  if(!vnode.text) {
    if(oldCh && ch) { // 新旧节点都有子节点，进行diff


    }else if(ch) {
      // 只有新的有子节点
      if(oldVnode.text) {
        elm.textContent = vnode.text
      }
      addNodes(elm, null, ch, 0, ch.length-1, insertedVnodeQueue)
    }else if(oldCh) {
      // 只有老节点有子节点
      removeVnodes(elm, null, ch, 0, ch.length-1, insertedVnodeQueue)
    }else if(oldCh.text) {
      // 只有老节点有text
      elm.textContent = ''
    }

  }else if(oldVnode.text !== newVnode.text) {
    if(oldCh) {
      removeVnodes(elm, oldCh, 0, oldCh.length-1)
      elm.textContent = vnode.text
    }
  }

  // call data.hook postpatch

  
}

export function init() {
  
  
  return function patch(oldVnode, newVnode) {

    let elm, parent, i
    //call pre hook  
    for(let i = 0; i < cbs.pre.length; i++) {
      cbs.pre[i]()
    }
    
    // 定义一个数组记录生成的vnode, 统一钩子函数的调用
    const insertedVnodeQueue = []

    if(!isVnode(oldVnode)) {
      // 写代码的技巧， 将两个不同类型的参数转换成同一类型，可以复用vndoe类的方法或者递归，而不是直接把逻辑就写在这个判断
      oldVnode = toEmptyVnode(oldVnode)
    }
   
    if(sameVnode(oldVnode, newVnode)) {
      patchVnode(oldVnode, newVnode, insertedVnodeQueue)
    }else {
      // 新旧节点不同，获取旧节点的parent
      elm = oldVnode.elm
      parent = elm && elm.parentNode

      // 创建新节点
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