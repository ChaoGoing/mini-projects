import { watchEffect}  from './reactivity/index.js'
import { mountElement, diff } from './render.js'

export const createApp = (rootComponent) => {
  const app = {
    mount: (rootCotainerId) => {
      const rootCotainer = document.querySelector(rootCotainerId)
      const setupResult = rootComponent.setup();
      let isMounted = false
      let prevTree
      watchEffect(() => {
        
        if(!isMounted) {
          const subTree = rootComponent.render(setupResult);
          mountElement(subTree, rootCotainer)
          prevTree = subTree
          isMounted = true
          
        }else {
          
          const subTree = rootComponent.render(setupResult);
          console.log('diff', prevTree, subTree)
          diff(prevTree, subTree)
          prevTree = subTree
        }
        
      })
    }
  }
  return app
};
