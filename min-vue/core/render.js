
function patchProp(el, key, prevVal, nextVal) {
  // console.log("patch")
  if(key.startsWith("on")) {
    const eventName = key.slice(2).toLocaleLowerCase()
    // console.log("eventName", eventName, nextVal)
    el.addEventListener(eventName, nextVal)
  }

  if(nextVal === null) {
    el.removeAttribute(key, prevVal)
  }else {
    el.setAttribute(key, nextVal)
  }
}

export const mountElement = (vnode, container) => {
  const el = (vnode.el = document.createElement(vnode.tag));

  if(vnode.props) {
    for(const key in vnode.props) {
      const val = vnode.props[key]
      patchProp(el, key, null, val)
    }
  }

  if(Array.isArray(vnode.children)) {
    vnode.children.forEach(child => {
      mountElement(child, el)
    })

  }else {
    el.append(new Text(vnode.children))
  }
  // console.log("container", container)
  container.append(el)
}

export const diff = (v1, v2) => {
  const { props: oldProps, children: oldChildren = [] } = v1
  const { props: newProps, children: newChildren = [] } = v2

  

  if(v1.tag !== v2.tag) {
    v1.el.replaceWith(createElement(v2.tag))
    Object.keys(v2.props).forEach(key => {
      patchProp(v1.el, key, null, v2.props[key])
    })
  }else {
    const el = (v2.el = v1.el)
    
    if(newProps){
      Object.keys(newProps).forEach(key => {
        if(newProps[key] !== oldProps[key]) {
          patchProp(el, key, oldProps[key], newProps[key])
        }
      })
    }
    Object.keys(oldProps).forEach(key => {
        if(!newProps[key]) {
          patchProp(el, key, oldProps, null)
        }
      })
    
    if (typeof newChildren === "string" || typeof newChildren === "number") {
      if (typeof oldChildren === "string" || typeof oldChildren === "number") {
        if (newChildren !== oldChildren) {
          console.log(el)
          el.textContent = newChildren;
        }
      } else if (Array.isArray(oldChildren)) {
        el.textContent = newChildren;
      }
    }

    if(Array.isArray(newChildren)) {
      if(typeof oldChildren === 'string') {
        el.innerHtml = ""
        newChildren.forEach(c => {
          mountElement(c, el)
        })
      }else if(Array.isArray(oldChildren)){
        const length = Math.min(newChildren.length, oldChildren.length);
        for (let i = 0; i < length; i++) {
          const oldVnode = oldChildren[i];
          const newVnode = newChildren[i];
          // 可以十分复杂
          diff(oldVnode, newVnode);
        }
      }
    }
    
    
  }
}