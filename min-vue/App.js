import {reactive} from './core/reactivity/index.js'

export const App = {
  render(h) {
    return h('div', { testId: this.state.testId },[
      h('div', {}, this.state.title),
      h('div', {}, this.state.content),
      h('button',{
        onClick: this.onClick
      },'click')
    ])
  },
  // render(context) {
  //   const div = document.createElement('div')
  //   div.innerText = context.state.content
  //   return div 
  // },
  setup() {
    const state = reactive({
      title: 123456,
      content: 0,
      testId: 1
    })
    window.state = state
    // window.state1 = reactive(0)
    window.state2 = reactive({
      content: 0
    })

    const onClick = () => {
      
      state.content++
      console.log("onclick", state.content)
    }

    return {
      state2: window.state2,
      state,
      onClick
    }
  }
}