https://mp.weixin.qq.com/s/F4BotNoasCUnb-yWiB12sg

对于 hook 来说，不存在重新渲染组件的逻辑，所以按函数的逻辑写(不用 useState,useEffect 等 react hook)也不会有性能问题，当 react 调用 hook 本来就是执行当前的代码
只要返回的值在外部有加上 effect dependency，就能保证组件不会有多余的渲染
解决父子组件更新延迟的一种思路：ref + forceUpdate

```js
function comp() {
  const stateRef = useRef(initialValue);
  if (isControlled) {
    stateRef.current = value;
  }

  function setState(v: SetStateAction<T>) {
    if (!isControlled) {
      stateRef.current = r;
      update();
    }
    // do something
  }
}
```
