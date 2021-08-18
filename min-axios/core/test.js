class Test{
  constructor() {
    console.log('this', JSON.stringify(this))
  }
  test() {
    console.log(Test.log) // undefined!!!
    console.log('test')
  }
}

Test.log = function() {
  console.log('log',this)
}

const t = new Test()
t.test()
Test.log()
const tt = t.test
tt()