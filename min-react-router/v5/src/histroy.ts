// 存储 history.listen 的回调函数
let listeners: Listener[] = [];
function listen(fn: Listener) {
  listeners.push(fn);
  return function() {
    listeners = listeners.filter(listener => listener !== fn);
  };
}

function push() {}

export const history = {
  // 通过getter来保证每次拿到的都是最新的location
  get location() {
    return location;
  },
  push,
  listen,
};
