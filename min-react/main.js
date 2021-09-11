import { createElement, render, Component } from './toy-react.js'

class MyComponent extends Component{
  constructor() {
    super()
    this.state = {
      a: '1'
    }
  }
  render() {
    const self = this
    return (
      <div>
        <div>{this.state.a}</div>
        <div onclick={() => { console.log(this.state.a); self.setState({ a: ++this.state.a }) }}>666</div>
        {this.children}
      </div>
    )
  }
}

const a = (
  // <div>
  //   <span>1</span>
  //   <span>2</span>
  // </div>
  <MyComponent>
    <div>123</div>
  </MyComponent>
)

render(a, document.body)