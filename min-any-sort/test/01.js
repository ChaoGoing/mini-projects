const songs = [
  { name: "songD", album: { name: "bbbbbb" } },
  { name: "songB", album: { name: "wow" } },
  { name: "songC", album: { name: "other" } },
  { name: "songA", album: { name: "woa" } },
  { name: "songD", album: { name: "aaaaaa" } },
];

const sortbyname = function (a, b) {
  return a.album.name === b.album.name
    ? 0
    : a.album.name < b.album.name
    ? -1
    : 1;
};

const sortbylen = function (a, b) {
  return a.album.length === b.album.length
    ? 0
    : a.album.length < b.album.length
    ? -1
    : 1;
};

const sortbynamethenlen = function (a, b) {
  const first_res = sortbylen(a, b);
  if (first_res !== 0) return first_res;
  return sortbyname(a, b);
};

// const res = songs.sort(sortbynamethenlen);

// console.log(res)

const compose = function (...args) {
  const len = args.length;
  let count = len - 1;
  let result;
  return function f1(..._args) {
    result = args[count].apply(this, _args); // this的指向？
    if (count <= 0) {
      return result;
    }
    count--;
    return f1.call(null, result);
  };
};

const sortby = function (...sortFn) {
  return (a, b) => {
    // const fn = sortFn[0]
    // const firres = fn(a,b)
    // if(firres !== 0) return firres
    // return sortby(sortfn[1], sortfn[2])
    const fnsLen = sortFn.length;
    let index = -1;
    let res = 0;
    while (++index < fnsLen) {
      res = sortFn[index](a, b);
      if (res !== 0) break;
    }
    return res;
  };
};

const getval = function (name) {
  const path = name.split(".");
  return (x) => {
    let val = x;
    while (x && path.length) {
      const _name = path.shift();
      val = val[_name];
    }
    return val;
  };
};

function generate(s) {
  const sort = new Sort();
  let [...actions] = s.split("-");
  actions = actions
    .filter((x) => x)
    .map((action) => {
      const [all, name, argsWithQuote, args] = action.match(
        /([^(]+)(\(([^)]*)\))?/
      );
      const plugin = argsWithQuote ? plugins[name] : plugins.default(name);
      plugin(sort, args || undefined);
    });
  return sort.seal();
}
// const a = getval('album.name')(songs[0])
// console.log('a', a)
const r1 = songs.sort(sortby(sortbylen, sortbyname));
console.log(r1);
