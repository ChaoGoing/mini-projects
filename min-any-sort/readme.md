## 函数式思维写一个排序工具

前置知识：
array.sort 本质上冒泡，会对原数组进行修改，并返回
array.sort 根据函数返回的值来进行排序： 零：不排序 正：b 在 a 前 负：a 在 b 前
默认情况下，sort() 方法将按字母和升序将值作为字符串进行排序。这适用于字符串（"Apple" 出现在 "Banana" 之前）。但是，如果数字按字符串排序，则 "25" 大于 "100" ，因为 "2" 大于 "1"。

1.对多个维度的排序函数进行抽象

```js
function sortByAlbumLenThenSongName(songA, songB) {
  const firstRes = sortByAlbumNameLen(songA, songB);
  // 先以 sortByAlbumNameLen 的结果为准，
  // 如果 sortByAlbumNameLen 没能得出顺序，
  // 返回了 0，
  // 那么继续排序，以 sortBySongName 的结果为准
  if (firstRes !== 0) return firstRes;
  else return sortBySongName(songA, songB);
}
const songs = [
  { name: "songB", album: { name: "wow" } },
  { name: "songC", album: { name: "other" } },
  { name: "songA", album: { name: "wow" } },
];
songs.sort(sortByAlbumNameLen);
```

通过 sortby 函数把多个排序函数进行组合
将上面的函数转换为 songs.sort(sortby(sortByNameLen, sortBySongName))的形式

```js
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
```

其实到这一步已经是满足很多业务需求了，下面是对一些特定的场景做一些内置函数的封装
在传入的 sort 函数中可以有内置的方法提供, 从而简化排序函数的编写

```

Sort类： 将sortBy函数的形式转换成队列的形式，为什么需要这样？ 为了优雅和装逼是一部分
sort类提供了plugin的形式，也就是可以对结果进行处理，当然函数也是可以实现的，就是可读性和扩展性应该会差很多




```

```js
// plugin其实就是从右往左的compose函数，先对当前的a,b进行sortFn比较, 然后使用plugin对结果进行定制化修改，例如，倒序插件就是对结果进行 取反
const plugin =
  (plug) =>
  (sortFn) =>
  (...args) =>
    plug(sortFn(...args));

// mapping 的话蕾丝compse从左往右进行，但不同的是对所有的单独的arg执行map函数，具体到排序中就是对传入的每个a,b进行值的处理，然后再进行排序操作
const mapping =
  (map) =>
  (sortFn) =>
  (...args) =>
    sortFn(...args.map((x) => map(x)));

const pass =
  (sortFn) =>
  (...args) =>
    sortFn(...args);

// pass函数只是作为空函数的起点，mapping和plguin都只是执行了一次，因为接下来要接收的参数是sortFn,
// 而sortFn的定义要等到this.compare的传入，这里很有组合的味道，pass 和 compose 起到的
// 作用类似于 curry
return this.pipeline.reduce((lastSortFn, current) => {
  const { _type, _value } = current;
  if (_type === "map") return mapping(lastSortFn(_value));
  if (_type === "plugin") return plugin(_value)(lastSortFn);
}, pass)(this.compare);

const plugins = {
  is: (sort, args = "") => sort.map((x) => x === args).sortby("boolean"),
  by: (sort, args) => sort.sortby(args),
  default: (name) => {
    const pathsStore = name.split(".");
    const getVal = (x) => {
      const paths = [...pathsStore];
      let val = x;
      while (val && paths.length) {
        next = paths.shift();
        val = val[next];
      }
      return val;
    };
    return (sort) => sort.map(getVal);
  },
};
```
