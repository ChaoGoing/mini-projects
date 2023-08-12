const { produce } = require("./immer");

const obj1 = {
  name: {
    nickname: {
      2021: "cc_2021_n",
      2022: "cc_2022_n",
    },
    basename: {
      2021: "cc_2021",
      2022: "cc_2022",
    },
  },
  city: { 上海: true },
};

const obj2 = produce(obj1, (draft) => {
  draft.name.basename["2022"] = "修改name";
});

console.log(obj1.name.basename === obj2.name.basename); // false
console.log(obj1.name.nickname === obj2.name.nickname); // true
console.log(obj1.city === obj2.city); // true
