const promote = function (subclass, prefix) {
  "use strict";

  var subP = subclass.prototype,
    supP =
      (Object.getPrototypeOf && Object.getPrototypeOf(subP)) || subP.__proto__;
  if (supP) {
    subP[(prefix += "_") + "constructor"] = supP.constructor; // constructor is not always innumerable
    for (var n in supP) {
      if (subP.hasOwnProperty(n) && typeof supP[n] == "function") {
        subP[prefix + n] = supP[n];
      }
    }
  }
  return subclass;
};

/**
 * 来源createjs
 * 作用： 将继承(prototype)中的prefix类添加prefix前缀，从而使被继承类的同名方法能够以前缀的方式调用而不被覆盖
 * 
    function ClassA(name) {
        this.name = name;
    }
    ClassA.prototype.greet = function () {
        return "Hello " + this.name;
    }

    function ClassB(name, punctuation) {
        this.ClassA_constructor(name);
        this.punctuation = punctuation;
    }
    createjs.extend(ClassB, ClassA);
    ClassB.prototype.greet = function () {
        return this.ClassA_greet() + this.punctuation;
    }
    createjs.promote(ClassB, "ClassA");
 */
