class 是 ES6 的新特性，可以用来定义一个类，实际上，class 只是一种语法糖，它是构造函数的另一种写法。（什么是语法糖？是一种为避免编码出错和提高效率编码而生的语法层面的优雅解决方案，简单说就是，一种便携写法。）

> typeof ClassName 结果竟然是“function”，而不是"class"

```javascript
class Person {

}
typeof Person // "function"
Person.prototype.constructor === Person // true
```

## 🚗 使用

用法和使用构造函数一样，通过 new 来生成对象实例

```javascript
class Person {

}
let jon = new Person()
```

## 🚌 constructor

每个类都必须要有一个 constructor，如果没有显示声明，js 引擎会自动给它添加一个空的构造函数：

```javascript
class Person {

}
// 等同于
class Person {
  constructor () {

  }
}
```

> constructor不能被显式调用

```javascript
console.log(p1.constructor);//输出是类体，而不是constructor的函数体
```

## 🏎 属性和方法

定义于 constructor 内的属性和方法，即定义在 this 上，属于实例属性和方法，否则属于原型属性和方法。

> 怎么在原型上添加属性呢？

```javascript
class Person {
  constructor (name) {
    //属于实例对象
    this.name = name;
    this.run = function(){console.log("running");}
  }
  //属于原型对象
  say () {
    console.log('hello')
  }
  //不能使用let var const,属于实例对象
  class = 11;
}

let jon = new Person()

jon.hasOwnPrototype('name') // true
jon.hasOwnPrototype('say') // false
```

## 🚓 属性表达式

```javascript
let methodName = 'say'
class Person {
  constructor (name) {
    this.name = name
  }

  [methodName] () {
    console.log('hello')
  }
}
```

## 🚚 静态方法

不需要通过实例对象，可以直接通过类来调用的方法，其中的 this 指向类本身

```javascript
class Person {
  static doSay () {
    this.say()
  }
  static say () {
    console.log('hello')
  }
}
Person.doSay() // hello
```

> 静态方法可以被子类继承，静态方法属于类对象，也是被子类的类对象继承，不是被子类实例对象继承

```javascript
// ...
class Sub extends Person {

}
Sub.doSay() // hello
```

可以通过 super 对象访问

```javascript
// ...
class Sub extends Person {
  static nice () {
    return super.doSay()
  }
}
Sub.nice() // hello
```

## 🚜 严格模式

不需要使用 use strict，因为只要代码写在类和模块内，就只能使用严格模式。

## 🏍 提升

class 不存在变量提升。

```javascript
new Person() // Uncaught ReferenceError: Person is not defined
class Person {

}
```

## 🚄 name 属性

name 属性返回了类的名字，即紧跟在 class 后面的名字。

```javascript
class Person {

}
Person.name // Person
```

## 🚈 this

默认指向类的实例。

## 🚂 取值函数（getter）和存值函数（setter）

```javascript
class Person {
  get name () {
    return 'getter'
  }
  set name(val) {
    console.log('setter' + val)
  }
}

let jon = new Person()
jon.name = 'jon' // setter jon
jon.name // getter
```

## 🛥 class 表达式

如果需要，可为类定义一个类内部名字，如果不需要，可以省略：

```javascript
// 需要在类内部使用类名
const Person = class Obj {
  getClassName () {
    return Obj.name
  }
}
// 不需要
const Person = class {}
```

立即执行的 Class：

```javascript
let jon = new class {
  constructor(name) {
    this.name = name
  }
  sayName() {
    console.log(this.name)
  }
}('jon')

jon.sayName() //jon
```


