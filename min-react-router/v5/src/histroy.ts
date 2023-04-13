import { readOnly, parsePath } from './utils';

export type State = object | null;
export type Listener = (location: Location) => void;
export interface history {
  push(): void;
}
export interface Path {
  pathname: string;
  search: string;
  hash: string;
}
export interface Location<S extends State = State> extends Path {
  state: S;
}

// 存储 history.listen 的回调函数
let listeners: Listener[] = [];
function listen(fn: Listener) {
  listeners.push(fn);
  return function() {
    listeners = listeners.filter(listener => listener !== fn);
  };
}

let location = getLocation();
function getLocation(): Location {
  const { pathname, search, hash } = window.location;
  return readOnly({
    pathname,
    search,
    hash,
    state: null,
  });
}
function getNextLocation(to: string, state: State = null) {
  // 解析to中包含的path 和 hash
  return readOnly({
    ...parsePath(to),
    state,
  });
}

function push(to: string, state: State) {
  location = getNextLocation(to, state);
  window.history.pushState(state, '', to);
  listeners.forEach(fn => fn(location));
}

// 用于处理浏览器前进后退操作
window.addEventListener('popstate', () => {
  location = getLocation();
  listeners.forEach(fn => fn(location));
});

export const history = {
  // 通过getter来保证每次拿到的都是最新的location
  get location() {
    return getLocation();
  },
  push,
  listen,
};
