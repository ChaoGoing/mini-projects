const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

const moduleAnalyser = filename => {
  // const path = path.join(__dirname, filename);
  // console.log(path)
  const content = fs.readFileSync(filename, 'utf8');
  const ast = parser.parse(content, {sourceType: "module"});
  // console.log(ast.program.body)
  // console.log(content);
  // 获取文件依赖的map
  const dependencies = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      // console.log(node)
      const dirname = path.dirname(filename);
      console.log("dirname", dirname)
      const newFile = './' + path.join(dirname, node.source.value);
      console.log("newFile", newFile, node.source.value)
      // console.log("node", node)
      // dependencies.push(newFile.replace(/\\/g, '/'))
      dependencies[node.source.value] = newFile.replace(/\\/g, '/');
    }
  })
  console.log(dependencies)
  // 代码转换成es5
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })
  return {
    filename: filename,
    dependencies,
    code,
  }
}

// const moduleInfo = moduleAnalyser('./src/index.js');
// console.log(moduleInfo);

const generateDependencyGraph = (entry) => {
  const entryModule = moduleAnalyser(entry);
  const graphArray = [entryModule];
  for(let i = 0; i < graphArray.length; i++) {
    const item = graphArray[i];
    const { dependencies } = item;
    if(dependencies) {
      for(let j in dependencies) {
        const result = moduleAnalyser(dependencies[j]);
        graphArray.push(result);
      }
    }
  }
  // console.log(graphArray);
}


const generateCode = (entry) => {
  const graph = generateDependencyGraph(entry);
  return 
  `
  (function(graph){
    function require(module) {
        function localRequire(relativePath) {
            return require(graph[module].dependencies[relativePath]);
        };
        var exports = {};
        (function(require, exports, code) {
            eval(code);
        })(localRequire, exports, graph[module].code);
        return exports;
    };
    require('${entry}');
  })(${JSON.stringify(graph)});
  `

}

const code = generateCode('./src/index.js')