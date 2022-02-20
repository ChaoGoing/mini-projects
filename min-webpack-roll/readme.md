### webpack最终打包代码的形态
1.首先，最外层是一个自执行函数
```
(function(module){

})({
  // xxx
})
```

自执行函数传入的参数是 module 对象，也就是通过构建ast后所有引入文件的map
大致长如下：
```js
{
   "./src/index.js":
    /*! no exports provided */
    /***/ function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      eval(
        '__webpack_require__.r(__webpack_exports__);
        /* harmony import */ 
        var _message_message_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./message/message.js */ "./src/message/message.js");
        
        console.log(_message_message_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
        //# sourceURL=webpack:///./src/index.js?'
      );
      /***/
    },
      0:
    /*! no static exports found */
    function (module, exports, __webpack_require__) {
      eval(
        'module.exports = __webpack_require__(/*! ./src/index.js */"./src/index.js");
        //# sourceURL=webpack:///multi_./src/index.js?'
      );
    },
}

```

怎么样将所有文件转换成module之后再说，先看拿到module后，webpack怎么样有序的执行所有文件的逻辑

```js
 (function(){
   // 1.定义installModule和require主函数
  var installedModules = {};
   // The require function
  function __webpack_require__(moduleId) {
    // 如果有缓存，直接返回, 否则执行注册
    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    
  }
    // Create a new module (and put it into the cache)
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    
    });
    
    // Execute the module function
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
  
    // Flag the module as loaded
    module.l = true;
  
    // Return the exports of the module
    return module.exports;
    
  }
  
  
  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;


  // 下面是webpack的一些辅助函数(动态import, esmodule转换, )
  /** 有时间再补充 **/

 })({})

```


### weipack命令 打包流程
1. 定义analyser函数
 - readfilesync 获取content
 - 解析文件内容 获得 dependencies 信息
 - 调用tabple 插件 对 文件进行loader处理

2.递归对入口模块的dependencies 调用 moduleAnalyser，获得module对象

3.将module对象传入 预定义好的 字符串js中
