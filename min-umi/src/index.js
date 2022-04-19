const Service = require("./core/Service")

const args = process.argv.slice(2);
(async function () {
  if (args[0] === "dev") {
    // run dev

    process.env.NODE_ENV = "development";

    // 核心代码，umi build 时候执行的也是这段代码
    const service = new Service({
      cwd: getCwd(),
      pkg: getPkg(process.cwd()),
    });
    await service.run({
      name: "dev",
      args,
    });


    let closed = false;
    // kill(2) Ctrl-C
    process.once('SIGINT', () => onSignal('SIGINT'));
    // kill(3) Ctrl-\
    process.once('SIGQUIT', () => onSignal('SIGQUIT'));
    // kill(15) default
    process.once('SIGTERM', () => onSignal('SIGTERM'));

    function onSignal(signal) {
      if (closed) return;
      closed = true;

      // 退出时触发插件中的onExit事件
      service.applyPlugins({
        key: 'onExit',
        type: service.ApplyPluginsType.event,
        args: {
          signal,
        },
      });
      process.exit(0);
    }
  } else {
    // run build
  }
})();
