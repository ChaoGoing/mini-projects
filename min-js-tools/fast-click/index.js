function FastClick(layer, options) {
  this.trackingClick = false;
  this.trackingClickStart = 0;
  this.targetElement = null;

  // Some old versions of Android don't have Function.prototype.bind
  function bind(method, context) {
    return function () {
      return method.apply(context, arguments);
    };
  }

  var methods = [
    "onMouse",
    "onClick",
    "onTouchStart",
    "onTouchMove",
    "onTouchEnd",
    "onTouchCancel",
  ];
  var context = this;
  for (var i = 0, l = methods.length; i < l; i++) {
    context[methods[i]] = bind(context[methods[i]], context);
  }

  if (typeof layer.onclick === "function") {
    // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
    // - the old one won't work if passed to addEventListener directly.
    oldOnClick = layer.onclick;
    layer.addEventListener(
      "click",
      function (event) {
        oldOnClick(event);
      },
      false
    );
    layer.onclick = null;
  }
}

FastClick.prototype.sendClick = function (targetElement, event) {
  var clickEvent, touch;

  // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
  if (document.activeElement && document.activeElement !== targetElement) {
    document.activeElement.blur();
  }

  touch = event.changedTouches[0];

  // 合成(Synthesise) 一个 click 事件
  // 通过一个额外属性确保它能被追踪（tracked）
  clickEvent = document.createEvent("MouseEvents");
  clickEvent.initMouseEvent(
    this.determineEventType(targetElement),
    true,
    true,
    window,
    1,
    touch.screenX,
    touch.screenY,
    touch.clientX,
    touch.clientY,
    false,
    false,
    false,
    false,
    0,
    null
  );
  clickEvent.forwardedTouchEvent = true; // fastclick的内部变量，用来识别click事件是原生还是合成的
  targetElement.dispatchEvent(clickEvent); //立即触发其click事件
};

FastClick.prototype.onTouchEnd = function (event) {
  var forElement,
    trackingClickStart,
    targetTagName,
    scrollParent,
    touch,
    targetElement = this.targetElement;

  if (!this.trackingClick) {
    return true;
  }

  // 避免 phantom 的双击（200ms内快速点了两次）触发 click
  // 我们在 ontouchstart 里已经做过一次判断了（仅仅禁用默认事件），这里再做一次判断
  if (event.timeStamp - this.lastClickTime < this.tapDelay) {
    this.cancelNextClick = true; //该属性会在 onMouse 事件中被判断，为true则彻底禁用事件和冒泡
    return true;
  }

  //this.tapTimeout是常量，值为700
  //识别是否为长按事件，如果是（大于700ms）则忽略
  if (event.timeStamp - this.trackingClickStart > this.tapTimeout) {
    return true;
  }

  // 得重置为false，避免input事件被意外取消
  this.cancelNextClick = false;
  this.lastClickTime = event.timeStamp; //标记touchend时间，方便下一次的touchstart做双击校验
  trackingClickStart = this.trackingClickStart;
  //重置 this.trackingClick 和 this.trackingClickStart
  this.trackingClick = false;
  this.trackingClickStart = 0;

  targetTagName = targetElement.tagName.toLowerCase();
  if (targetTagName === "label") {
    //是label则激活其指向的组件
    forElement = this.findControl(targetElement);
    if (forElement) {
      this.focus(targetElement);
      //安卓直接返回（无需合成click事件触发，因为点击和激活元素不同，不存在点透）
      if (deviceIsAndroid) {
        return false;
      }

      targetElement = forElement;
    }
  } else if (this.needsFocus(targetElement)) {
    //非label则识别是否需要focus的元素

    //手势停留在组件元素时长超过100ms，则置空this.targetElement并返回
    //（而不是通过调用this.focus来触发其聚焦事件，走的原生的click/focus事件触发流程）
    //这也是为何文章开头提到的问题中，稍微久按一点（超过100ms）textarea是可以把光标定位在正确的地方的原因
    //另外iOS下有个意料之外的bug——如果被点击的元素所在文档是在iframe中的，手动调用其focus的话，
    //会发现你往其中输入的text是看不到的（即使value做了更新），so这里也直接返回
    if (
      event.timeStamp - trackingClickStart > 100 ||
      (deviceIsIOS && window.top !== window && targetTagName === "input")
    ) {
      this.targetElement = null;
      return false;
    }

    this.focus(targetElement);
    this.sendClick(targetElement, event); //立即触发其click事件，而无须等待300ms

    //iOS4下的 select 元素不能禁用默认事件（要确保它能被穿透），否则不会打开select目录
    //有时候 iOS6/7 下（VoiceOver开启的情况下）也会如此
    if (!deviceIsIOS || targetTagName !== "select") {
      this.targetElement = null;
      event.preventDefault();
    }

    return false;
  }

  if (deviceIsIOS && !deviceIsIOS4) {
    // 滚动容器的垂直滚动偏移改变了，说明是容器在做滚动而非点击，则忽略
    scrollParent = targetElement.fastClickScrollParent;
    if (
      scrollParent &&
      scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop
    ) {
      return true;
    }
  }

  // 查看元素是否无需处理的白名单内（比如加了名为“needsclick”的class）
  // 不是白名单的则照旧预防穿透处理，立即触发合成的click事件
  if (!this.needsClick(targetElement)) {
    event.preventDefault(); // 阻止默认事件（屏蔽之后的click事件）
    this.sendClick(targetElement, event);
  }

  return false;
};
