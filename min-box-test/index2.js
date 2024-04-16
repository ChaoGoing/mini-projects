function createSandbox(callback) {
  const iframe = document.getElementById("sandbox");
  if (!iframe) {
    return console.error("沙箱iframe未找到");
  }

  // 确保iframe完全加载后再执行代码
  iframe.onload = function () {
    const iframeWindow = iframe.contentWindow;

    // 在沙箱环境中定义一些安全的全局变量或函数，如果需要的话
    iframeWindow.safeGlobalVar = {
      /* 安全的数据或方法 */
    };

    // 执行回调函数，传入沙箱的window对象，以便在其中执行代码
    callback(iframeWindow);
  };

  // 重新加载iframe以确保环境清洁
  iframe.src = "about:blank";
}

// 使用沙箱
createSandbox(function (sandboxWindow) {
  // 在沙箱环境中执行代码
  sandboxWindow.eval('console.log("Hello from the sandbox!");');
});
