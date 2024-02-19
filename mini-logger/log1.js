const createlog =
  (util) =>
  (...args) => {
    const fun = console[util] ? console[util] : console.log;
    fun.apply(void 0, args);
  };
const gererateColorLogStr = (...arr) => {
  let fi = [""];
  for (let key = 0; key < arr.length; key++) {
    const [first, ...other] = arr[key];
    fi[0] += `%c${first}`;
    fi = fi.concat(other);
  }
  return fi;
};
createlog("log")(
  ...gererateColorLogStr(["123", "color: blue"], ["456", "color: green"])
);
