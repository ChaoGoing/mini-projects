import {reactive} from './core/reactivity/index.js'
import {h} from './core/h.js'

export const App = {
  render(content) {
    return h('div', { testId: content.state.testId },[
      h('div', {}, content.state.title),
      h('div', {}, content.state.content),
      h('button',{
        onClick: content.onClick
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