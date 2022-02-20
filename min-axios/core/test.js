class Test{
  constructor() {
    console.log('this', JSON.stringify(this))
  }
  test() {
    console.log(this) 
    console.log('test')
  }
}

Test.log = function() {
  console.log('log',this)
}

const t = new Test()
t.test() // 实例Test{}
Test.log()
const tt = t.test
tt() // undefined!!!