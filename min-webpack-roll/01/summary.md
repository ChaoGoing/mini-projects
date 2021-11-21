fs模块api
fs.readFileSync(filename, 'utf8') 读取文件, 第二个参数可选值？以及含义区别

引入文件需要添加后缀名


思路
function moduleAnalyse
1.读取文件
2.转换成ast(基于babel工具库)
3.生成依赖对象, 根据ast,通过@babel/tranverse获取文件的引入/依赖 并 生成转换路径后的map
4.将代码转成es5, 根据ast,通过@babel/core和@babel/preset-env实现
5.返回结构对象

function generateDependencyGraph
递归获取所有文件的依赖，生成依赖树

function generateCode
用闭包包裹生成的code