var _class;

const decoratorClass = targetClass => {
  targetClass.test = '123';
};

let Student = decoratorClass(_class = class Student {
  constructor(type) {
    this.name = 'foo';
  }

}) || _class;

console.log(Student.test);
