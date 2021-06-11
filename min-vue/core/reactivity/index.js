

let currentEffect
class Dep {
  constructor() {
    this.effects = new Set();
  }
  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect);
    }
  }
  notice() {
    for (let effect of this.effects) {
      effect();
    }
  }
}

export const watchEffect = (effect) => {
  currentEffect = effect
  effect()
  currentEffect = null
}

const targetMap = new WeakMap()

export const reactive = function(raw) {

  const getDep = (target, key) => {
    let depsMap = targetMap.get(target)
    if(!depsMap) {
      depsMap = new Map()
      targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if(!dep) {
      dep = new Dep()
      depsMap.set(key, dep)
    }
    return dep
  }

  return new Proxy(raw, {
    get(target, key) {
      const dep = getDep(target, key)
      dep.depend()
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      const dep = getDep(target, key)
      const result = Reflect.set(target, key, value)
      dep.notice()
      return result
    }
  })
}



// effect

// reactive

// const obj = reactive({
//   name: 'achao',
//   age: '20',
// })

// let b
// watchEffect(() => {
//   b = obj.name + 'reactive'
//   console.log(b)
// })

// obj.name = '阿超'


