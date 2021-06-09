const iframe = document.createElement('iframe', { url: 'about:blank' })

document.body.append(iframe)
const sandboxGlobal = iframe.contentWindow
sandboxGlobal.log = v => v+v
const scopeProxy = new Proxy(sandboxGlobal, {})

function sandBoxingEval(scopeProxy, userCode) {
  with(scopeProxy) {
    eval(`
      const safeFactory = fun => (...args) => fun(...args)
      log = safeFactory(log)
    `)
    eval(userCode)
  }
  
}
const code = `
    log.constructor.prototype.__proto__.aa = 'aa'
    console.log((log(1)))
  `

sandBoxingEval(sandboxGlobal, code)
console.log(({}).aa)