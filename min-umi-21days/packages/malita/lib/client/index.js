"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // client/index.js
  var require_client = __commonJS({
    "client/index.js"(exports) {
      function getSocketHost() {
        const url = location;
        const host = url.host;
        const isHttps = url.protocol === "https:";
        return `${isHttps ? "wss" : "ws"}://${host}`;
      }
      if ("WebSocket" in window) {
        const socket = new WebSocket(getSocketHost(), "malita-hmr");
        let pingTimer = null;
        socket.addEventListener("message", (_0) => __async(exports, [_0], function* ({ data }) {
          data = JSON.parse(data);
          if (data.type === "connected") {
            console.log(`[malita] connected.`);
            pingTimer = setInterval(() => socket.send("ping"), 3e4);
          }
          if (data.type === "reload")
            window.location.reload();
        }));
        function waitForSuccessfulPing(ms = 1e3) {
          return __async(this, null, function* () {
            while (true) {
              try {
                yield fetch(`/__malita_ping`);
                break;
              } catch (e) {
                yield new Promise((resolve) => setTimeout(resolve, ms));
              }
            }
          });
        }
        socket.addEventListener("close", () => __async(exports, null, function* () {
          if (pingTimer)
            clearInterval(pingTimer);
          console.info("[malita] Dev server disconnected. Polling for restart...");
          yield waitForSuccessfulPing();
          location.reload();
        }));
      }
    }
  });
  require_client();
})();
