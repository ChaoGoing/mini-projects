import React, { createElement } from 'react'
import ReactDom from 'react-dom'
import { createRoot } from './kreact/dom.js'
import { useReducer } from './kreact/hooks.js'


const FunctionComponent = () =>{

  const [x, setX] = useReducer((x) => x+1, 0)
  console.log("x", x)

  return (
    <div>
      <div className="func">{ x }</div>
      <button onClick={() => { setX() }}>setX</button>
    </div>
  )
}


const app = (
  <div>
    <div>child 1</div>
    <div>child 2</div>
    <FunctionComponent />
  </div>
)

// ReactDOM.render(app, document.getElementById('app'))
// console.log(createRoot)
createRoot(document.getElementById('app')).render(app)

