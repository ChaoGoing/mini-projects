const decoratorClass = (targetClass) => {
  targetClass.test = '123'
}

@decoratorClass
class Student {
  constructor(type) {
    this.name = 'foo'
  }
}

console.log(Student.test)