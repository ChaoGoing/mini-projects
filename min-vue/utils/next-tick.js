
const callbacks = []
let pending = false
let timeFunc

function flushcallback(params) {
  console.log('cb', callbacks)
  pending = false
  const copys = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copys.length; i++) {
    copys[i]()
  }
}

function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

// 判断当前环境支持哪一种更新机制
if (Promise !== undefined && isNative(Promise)) {
  timeFunc = () => {
    const p = Promise.resolve()
    p.then(flushcallback)
  }
} else {
  timeFunc = () => {
    setTimeout(flushcallbacks)
  }
}

function nextTick(cb, ctx) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        console.log('error in nextTcik')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })

  if (!pending) {
    pending = true
    timeFunc(flushcallback)
  }

  if (!cb && typeof Promise !== undefined) {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }

}

nextTick(() => {
  console.log(3)
  nextTick(() => {
    console.log(5)
  })
  console.log(4)
})
nextTick(() => {
  console.log('next')
})
nextTick().then(() => {
  console.log("then")
})
