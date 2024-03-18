/**
 * 学习文章：https://mp.weixin.qq.com/s/ZMLf0znRMaeBMc5n-DgoXQ
 */

// importScript.js
export default function (url) {
  return new Promise(function (resolve, reject) {
    const el = document.createElement("script"); // 创建 script 元素
    el.src = url; // url 赋值
    el.async = false; // 保持时序
    const loadCallback = function () {
      // 加载成功回调
      el.removeEventListener("load", loadCallback);
      resolve(result);
    };
    const errorCallback = function (evt) {
      // 加载失败回调
      el.removeEventListener("error", errorCallback);
      var error = evt.error || new Error("Load javascript failed. src=" + url);
      reject(error);
    };
    el.addEventListener("load", loadCallback);
    el.addEventListener("error", errorCallback);
    document.body.appendChild(el); // 节点插入
  });
}
