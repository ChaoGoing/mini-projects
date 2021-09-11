const RenderToDom = Symbol('render to dom')

class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    if(name.match(/^on([\s\S]+)$/)) {
      console.log(RegExp.$1.toLowerCase())
      this.root.addEventListener(RegExp.$1.toLowerCase(), value)
    }else {
      this.root.setAttribute(name, value)
    }
  }
  appendChild(component) {
    // this.root.appendChild(component.root)
    let range = document.createRange()
    range.setStart(this.root, this.root.childNodes.length)
    range.setEnd(this.root,  this.root.childNodes.length)
    console.log(component)
    component[RenderToDom](range)
  }
  [RenderToDom](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

class TextWrapper {
  constructor(text) {
    this.root = document.createTextNode(text)
  }
  [RenderToDom](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

export class Component{
  constructor() {
    this._root = null
    this.children = []
    this.props = Object.create({})
  }
  setAttribute(name, value) {
    
    this.props[name] = value
  }
  appendChild(component) {
    this.children.push(component)
  }
  [RenderToDom](range) {
    this._range = range
    const render = this.render()
    console.log("component render", render)
    render[RenderToDom](range)
  }
  rerender(range) {
    console.log(this._range)
    // range.deleteContents()
    this[RenderToDom](this._range)
  }
  setState(newState) {
    console.log(JSON.stringify(this.state), newState)
    if(!this.state || typeof this.state !== 'object') {
      this.state = newState
      this.rerender()
      return 
    }
    let merge = (oldState, newState) => {
      for(let p in newState) {
        if(oldState[p] === null || typeof oldState[p] !== 'object') {
          oldState[p] = newState[p]
        }else {
          merge(oldState[p], newState[p])
        }
      }
    }
    merge(this.state, newState)
    this.rerender()
  }
  // get root() {
  //   if(!this._root) {
  //     this._root = this.render().root
  //   }
  //   return this._root
  // }
}

export function createElement(type, attributes = [], ...children) {
  let e
  if(typeof type === 'string') {
    e = new ElementWrapper(type)
  }else {
    // 不需要加()，构造type指向的类的实例
    e = new type
  }

  if(!attributes) attributes = {}
  for(let attr in attributes) {
    e.setAttribute(attr, attributes[attr])
  }

  function insertChildren(children) {
    for(let child of children) {
      if(typeof child === 'string' || typeof child === 'number') {
        child = new TextWrapper(child)
      }
      if(typeof child === 'object' && child instanceof Array){
        insertChildren(child)
      }else {
        e.appendChild(child)
      }
    }
  }

  insertChildren(children)

  return e 
}

export function render(component, parent) {
  let range = document.createRange()
  range.setStart(parent, 0)
  range.setEnd(parent,  parent.childNodes.length)
  range.deleteContents()
  component[RenderToDom](range)
}