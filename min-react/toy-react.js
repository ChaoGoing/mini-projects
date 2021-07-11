class ElementWrapper {
  constructor(type) {

  }
  setAttribute(name, value) {

  }
  appendChild() {

  }
}

class TextWrapper {
  constructor() {

  }
  setAttribute() {

  }
  appendChild() {

  }
}

export function render() {
  
}


export function createElement(type, attributes = [], ...children) {
  let e
  if(typeof type === 'string') {
    e = document.createElement(type)
  }else {
    e = new type
  }


  if(!attributes) attributes = []
  for(let attr of attributes) {
    e.setAttribute(attr, attributes[attr])
  }

  for(let child of children) {
    if(typeof child === 'string') {
      child = document.createTextNode(child)
    }
    e.appendChild(child)
  }
  return e 
}