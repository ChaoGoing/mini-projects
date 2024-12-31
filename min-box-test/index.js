const iframe = document.createElement("iframe", { url: "about:blank" });
// 等待iframe加载完成
iframe.onload = function () {
  // 向iframe发送消息
  var targetOrigin = "http://127.0.0.1:5500/"; // 替换为iframe的实际源
  iframe.contentWindow.postMessage("Hello, sandbox!", targetOrigin);
};
// 监听来自iframe的消息
window.addEventListener("message", function (event) {
  // 检查消息来源是否符合预期
  if (event.origin !== "http://127.0.0.1:5500") {
    return; // 来源不匹配时忽略消息
  }
  // 处理接收到的消息
  console.log("Received message from iframe:", event.data);
});

document.body.append(iframe);
const sandboxGlobal = iframe.contentWindow;
sandboxGlobal.log = (v) => v + v;
const scopeProxy = new Proxy(sandboxGlobal, {});

function sandBoxingEval(scopeProxy, userCode) {
  with (scopeProxy) {
    eval(`
      const safeFactory = fun => (...args) => fun(...args)
      log = safeFactory(log)
    `);
    eval(userCode);
  }
}
const code = `
    log.constructor.prototype.__proto__.aa = 'aa'
    console.log(log.constructor.prototype.__proto__)
    console.log({}.aa)
    console.log((log(1)))
  `;

sandBoxingEval(sandboxGlobal, code);
console.log({}.aa);
