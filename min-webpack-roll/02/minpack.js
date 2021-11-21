const fs = require('fs');
const path = require('path');

const babel = require('@babel/core')
const traverse = require('@babel/traverse').default;
const createHtml = require('./createHtml.js')

let ID = 0

function createAsset(filename) {

  const context = fs.readFileSync(filename, 'utf-8')

  console.log(context)


  const ast = babel.parseSync(context, {
    sourceType: 'module',
  });

  const depencies = []

  traverse(ast, {
    // 由于 ESM 是静态的，所以要分析他很容易
    // “静态”意味着你不能引入一个变量，也不能根据条件引入其他模块
    // 每当我们看到一个 import 声明，就将他的值记录下来作为依赖
    ImportDeclaration: ({node}) => {
      // 将 import 的值存入 dependencies 数组中
      depencies.push(node.source.value);
    },
  });

  const id = ID++

  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ['@babel/preset-env']
  })

  return {
    id,
    filename,
    depencies,
    code,
  }

}

function createGraph(entry) {
  const mainAsset = createAsset(entry)
  const queue = [mainAsset]

  for(let asset of queue) {

    asset.mapping = {}

    const dirname = path.dirname(asset.filename)
    console.log("dirname", dirname)
    asset.depencies.forEach(relative_path => {
      const absolute_path = path.join(dirname, relative_path)
      const child = createAsset(absolute_path)
      asset.mapping[relative_path] = child.id
      queue.push(child)
    })

  }
  
  return queue

}



console.log(createGraph(path.resolve(__dirname, './src/entry.js')))