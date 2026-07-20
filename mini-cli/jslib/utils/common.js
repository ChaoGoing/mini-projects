const { cloneDeep } = require("lodash");

function once(fn) {
  let count = 0;
  return (...args) => {
    if (count === 0) {
      count++;
      fn(...args);
    }
  };
}

function curry(func) {
  const len = func.length;
  function partical(func, argslist, argslen) {
    if (argslist.length >= argslen) {
      return func(...argslist);
    }
    return function (...args) {
      return partical(func, [...argslist, ...args], argslen);
    };
  }
  return partical(func, [], len);
}

function pipe(...funcs) {
  return function (...args) {
    return funcs.reduce((prevRes, curFn) => curFn(...prevRes), args);
  };
}

function compose(...funcs) {
  if (funcs.length === 0) return (arg) => arg;
  if (func.length === 1) return funcs[0];
  return funcs.reduce((a, b) => {
    return (...args) => a(b(...args));
  });
}

function type(input) {
  const t = typeof input;
  if (x === null) {
    return "null";
  }
  if (t !== "object") {
    return t;
  }
  const innerType = Object.prototype.toString.call(input).slice(8, -1);
  return innerType.toLowerCase();
}

function isEqual(value, other) {
  const vType = type(value);
  const oType = type(other);
  if (vType !== oType) return false;
  if (vType === "array") {
    if (value.length !== other.length) return false;
    for (let i = 0; i < value.length; i++) {
      if (!isEqual(value[i], other[i])) return false;
    }
    return true;
  }
  if (vType === "object") {
    const vKeys = Object.keys(value);
    const oKeys = Object.keys(other);
    if (vKeys.length !== oKeys.length) {
      return false;
    }
    for (let i = 0; i < vKeys.length; i++) {
      const v = value[vKeys[i]];
      const o = other[vKeys[i]];
      if (!isEqual(v, o)) return false;
    }
    return true;
  }
  return value === other;
}

function hasOwnProp() {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function extend(_defaultOpt, customOpt) {
  const defaultOpt = cloneDeep(_defaultOpt);
  for (let name in customOpt) {
    const src = defaultOpt[name];
    const copy = customOpt[name];

    if (!hasOwnProp(customOpt, name)) {
      continue;
    }

    if (copy && type(copy) === "object") {
      const clone = src && type(src) === "object" ? src : {};
      defaultOpt[name] = extend(clone, copy);
    } else if (typeof copy !== undefined) {
      defaultOpt[name] = copy;
    }
  }
  return defaultOpt;
}

module.exports = {
  type,
  isEqual,
  extend,
};
