class Scanner {
  constructor(templateStr) {
    this.templateStr = templateStr;
    this.pos = 0;
    this.tail = this.templateStr;
  }

  scan(tag) {
    if (this.tail.indexOf(tag) === 0) {
      this.pos += tag.length;
      this.tail = this.templateStr.substring(this.pos);
    }
  }

  scanUntil(stopTag) {
    const pos_backup = this.pos;
    while (!this.eos() && this.tail.indexOf(stopTag) != 0) {
      this.pos++;
      this.tail = this.templateStr.substring(this.pos);
    }
    // 开始的位置到指针的位置不包括this.pos
    return this.templateStr.substring(pos_backup, this.pos)
  }

  eos() {
    return this.pos >= this.templateStr.length;
  }
}

function parseTemplateToTokens(templateStr) {
  var tokens = [];
  // 创建扫描器
  var scanner = new Scanner(templateStr);
  var words;
  // 让扫描器工作
  while (!scanner.eos()) {
    // 收集开始标记出现之前的文字
    words = scanner.scanUntil('{{');
    if (words != '') {
      // 尝试写一下去掉空格，智能判断是普通文字的空格，还是标签中的空格
      // 标签中的空格不能去掉，比如<div class="box">不能去掉class前面的空格
      // 是不是在尖角号里面，默认为不是
      let isJJH = false;
      let _words = '';
      for (let i = 0; i < words.length; i++) {
        // 判断是否在标签里
        if (words[i] == '<') {
          isJJH = true;
        } else if (words[i] == '>') {
          isJJH = false;
        }
        // 如果这项不是空格，拼接上
        if (!/\s/.test(words[i])) {
          _words += words[i];
        } else {
          // 如果这项是空格，只有当它在标签内的时候，才拼接上
          if (isJJH) {
            _words += ' ';
          }

        }
      }
      !!_words && tokens.push(['text', _words]);
      // 过双大括号
      scanner.scan('{{');
      // 收集开始标记出现之前的文字
      words = scanner.scanUntil('}}');
      if (words != '') {
        // 这个words就是{{}}中间的东西，判断一下首字符
        if (words[0] == "#") {
          // 存起来，从下标为1的项开始存,因为下标为0的项是#
          tokens.push(['#', words.substring(1)]);
        } else if (words[0] == "/") {
          tokens.push(['/', words.substring(1)]);
        } else {
          tokens.push(['name', words]);
        }
      }
      scanner.scan('}}');
    }
  }
  // 返回折叠的tokens
  return nestTokens(tokens);
}

function nestTokens(tokens) {
  // console.log('tokens: ', tokens);
  // 结果数组
  let nestTokens = [];
  // 栈结构，存放小tokens，栈顶（靠近端口的，最新进入的）的tokens数组中当前操作的这个tokens小数组
  let sections = [];
  // 收集器，天生指向nestedTokens结果数组，引用类型值，所以指向的是同一个数组
  // 收集器的指向会变化。当遇见#的时候，收集器会指向这个token的下标为2的新数组
  let collector = nestTokens;
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    console.log('collector: ', token, collector);
    // console.log('token: ', token);
    switch (token[0]) {
      case '#':
        // 收集器中放入这个token
        collector.push(token);
        // 入栈
        sections.push(token);
        // 收集器要换人,给token添加下标为2的项，并且将收集器指向它
        collector = token[2] = [];
        // console.log('#: ', sections, collector);
        break;
      case '/':
        // 出栈，pop()会返回刚刚弹出的顶
        sections.pop();
        // 改变收集器为栈结构队尾(队尾是栈顶)那项的下标为2的数组
        // 如果collector没有值则指回结果
        console.log('sections: ', sections);
        collector = sections.length > 0 ? sections[sections.length - 1][2] : nestTokens;
        break;
      default:
        // 甭管当前的collector是谁，可能是结果nestedTokens，也可以能是token的下标为2的数组，甭管是谁，推入collector即可
        collector.push(token);
    }
  }
  return nestTokens;
}

function lookup(dataObj, keyName) {
  console.log('lookup: ', dataObj, keyName);
  // 看看keyName中有没有点符号，但不能是.本身，{{.}}单纯.也用于解析数据
  if (keyName.indexOf('.') != -1 && keyName != '.') {
    // 如果有点符号，那么拆开
    let keys = keyName.split('.');
    // 设置一个临时变量，这个临时变量用于周转，一层一层找下去
    let temp = { ...dataObj };
    //  每找一层，就把他设置为新的临时变量
    for (let i = 0; i < keys.length; i++) {
      // 拆分属性来一层一层寻找需要的data
      temp = temp[keys[i]];
    }
    return temp;
  }
  // 如果这里面没有点符号
  return dataObj[keyName];
}

function parseArray(token, data) {
  console.log('parseArray', token, data);
  // 得到整体数据data中这个数组要使用的部分
  let v = lookup(data, token[1]);
  // 结果字符串
  let resultStr = '';
  console.log(v);
  // 遍历v数组，v一定是数组
  // 下面这个循环可能是整个包中最难思考的一个循环
  // 它是遍历数据，而不是遍历tokens，数组中的数据有几条，就要遍历几条
  for (let i = 0; i < v.length; i++) {
    // 拼接返回，递归调用
    // 递归调用renderTemplate
    resultStr += renderTemplate(token[2], {
      // 现在这个数据小对象，是v[i]的展开，就是v[i]本身
      ...v[i],
      // 这里要补一个"."属性并且替代当前项
      '.': v[i]
    });
  }
  // 返回的结果会加到最后结果字符串中，由于最终测试的地方是数组
  // 因此思路要局限在数组的解析上
  return resultStr;
}

function renderTemplate(tokens, data) {
  let resultStr = '';
  console.log('tokens: ', tokens, data);
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    console.log('token: ', token);
    if (token[0] == 'text') {
      resultStr += token[1];
    } else if (token[0] == 'name') {
      // 如果是name类型，那么就直接使用它的值，当然要用lookup
      // 因为防止这里是"a.b.c"有点的形式
      resultStr += lookup(data, token[1]);
    } else if (token[0] == '#') {
      // 递归，解析下一层
      // 调用parseArray函数来辅助识别token[0]='#'的token
      resultStr += parseArray(token, data);
    }
  }
  return resultStr

}

const _tokens = parseTemplateToTokens(`<div>{{students}}
  {{name}}
  {{#class}}
  <div>{{.}}</div>
  {{/class}}
  {{/students}}</div>`)
const _data = {
  students: '123',
  name: '啊超的煎熬',
  class: [
    1, 2, 3
  ]
}
const domStr = renderTemplate(_tokens, _data);
console.log('domStr: ', domStr);