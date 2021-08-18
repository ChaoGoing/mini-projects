/**
 * 将字符串转为词素数组
 * @param {*} input 
 * @returns 
 */

function tokenizer(input) {
  let current = 0
  let tokens = []
  
  while(current < input.length) {
    let char = input[current]
    console.log('char', char)
    if(char === '(') {
      tokens.push({
        type: 'paren',
        valaue: '('
      })
      current++
      continue
    }

    if(char === ')') {
      tokens.push({
        type: 'paren',
        value: ')'
      })
      current++
      continue
    }

    let WHITESPACE = /\s/
    if(WHITESPACE.test(char)) {
      ++current
      continue
    }

    let NUMBER = /[0-9]/
    if(NUMBER.test(char)) {
      let value = '' 
      while((NUMBER.test(char))){
        value+=char
        char = input[++current]
      }
      tokens.push({
        type: 'number',
        value
      })
      continue
    }

    if(char === '"') {
      let value = ''
      char = input[++current]
      while(char !== '"') {
        value += char
        char = input[++current]
      }
      tokens.push({
        type: 'string',
        value
      })
      char = input[++current]
      continue 
    }

    const LETTERS = /[a-z]/i
    if(LETTERS.test(char)) {
      let value = ''
      while(LETTERS.test(char)) {
        value+=char
        char = input[++current]
      }
      tokens.push({
        type: 'name',
        value
      })
      continue
    }
    
    throw new Error('unknown syntax')
  }

  return tokens
}

// console.log(tokenizer('(add 4 2)'));
// console.log(tokenizer('(substruct 2 2)'));

function parser(tokens) {
  let current = 0;
  function walk() {
    let token = tokens[current]
    if(token.type === 'number') {
      current++
      return {
        type: 'NumberLiteral',
        value: token.value
      }
    }
    if(token.type === 'string') {
      current++
      return {
        type: 'StringLiteral',
        value: token.value
      }
    }
    if(token.type === 'paren' && token.valaue === '(') {
      token = tokens[++current]
      let node = {
        type: 'CallExpression',
        name: token.value,
        params: []
      }
      // skip name token
      token = tokens[++current]
      while(token.type !== 'paren' || (token.type === 'paren' && token.value !== ')')){
        node.params.push(walk())
        token = tokens[current]
      }
      current++
      return node
    }
    console.log('unknown token type', token)
  }
  const ast = {
    type: 'Program',
    body: []
  }
  while(current < tokens.length) {
    ast.body.push(walk())
  }
  return ast
}

function traverser(ast, visitor) {
  function traverArray(array, parent) {
    array.forEach(child => {
      traverNode(child, parent)
    });
  }

  function traverNode(node, parent) {
    let methods = visitor[node.type]
    if(methods && methods.enter) {
      methods.enter(node, parent)
    }
    switch (node.type) {
      case 'Program': 
        traverArray(node.body, node)
        break
      case 'CallExpression':
        traverArray(node.params, node)
        break
      case 'NumberLiteral':
      case 'StringLiteral':
        break
      default:
        console.log('unknown type in traverser')
    }
  }

  traverNode(ast, null)

}

function transformer(ast) {
  let newAst = {
    type: 'Program',
    body: []
  }

  ast._context = newAst.body

  traverser(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value
        })
      }
    },
    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value
        })
      }
    },
    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name
          },
          arguments: []
        }
        node._context = expression.arguments
        if(parent.type !== 'CallExpresion'){
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          }
        }
        parent._context.push(expression)
      }
    }
  })
  return newAst
}


function codeGenerator(node) {
  switch(node.type) {
    case 'Program':
      return node.body.map(codeGenerator).join('\n')
      
    case 'ExpressionStatement':
      return (
        codeGenerator(node.expression) + ';'
      )

    case 'CallExpression':
      return (
        codeGenerator(node.callee) + '(' + node.arguments.map(codeGenerator).join(',') + ')'
      )

    case 'Identifier': 
      return node.name
    case 'NumberLiteral': 
      return node.value
    case 'StringLiteral':
      return '"' + node.value + '"'
    default:
      console.log('unknown error in generate', node)
  }
}

const tokens = tokenizer('(substruct 4 (add 4 2))')
console.log(tokens)

const ast = parser(tokens)
console.log(ast)

const newAst = transformer(ast)
console.log(JSON.stringify(newAst))

console.log(codeGenerator(newAst));