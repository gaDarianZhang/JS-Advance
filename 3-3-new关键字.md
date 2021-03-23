# Introduction

对于大部分前端开发者而言，new一个构造函数或类得到对应实例，是非常普遍的操作了。下面的例子中分别通过构造函数与class类实现了一个简单的创建实例的过程。

```javascript
// ES5构造函数
let Parent = function (name, age) {
    this.name = name;
    this.age = age;
};
Parent.prototype.sayName = function () {
    console.log(this.name);
};
const child = new Parent('听风是风', 26);
child.sayName() //'听风是风'


//ES6 class类
class Parent {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    sayName() {
        console.log(this.name);
    }
};
const child = new Parent('echo', 26);
child.sayName() //echo
```

但new不应该像一个黑盒，我们除了知道结果，更应该明白过程究竟如何。那么那么这篇文章主要围绕两点展开，**第一，js中new一个对象时到底发生了什么**，**第二，知道了原理后我们通过js来实现一个简单的new方法**。

# new做了什么

比较直观的感觉，当我们new一个构造函数，得到的实例继承了**构造器的构造属性**(this.name这些)以及**原型上的属性**。

在《JavaScript模式》这本书中，new的过程说的比较直白，当我们new一个构造器，主要有三步：

> • 创建一个空对象，将它的引用赋给 this，继承函数的原型。
> • 通过 this 将属性和方法添加至这个对象
> • 最后返回 this 指向的新对象，也就是实例（如果没有手动返回其他的对象）

我们改写上面的例子，大概就是这样：

```javascript
// ES5构造函数
let Parent = function (name, age) {
    //1.创建一个新对象，赋予this，这一步是隐性的，
    // let this = {};
    //2.给this指向的对象赋予构造属性
    this.name = name;
    this.age = age;
    //3.如果没有手动返回对象，则默认返回this指向的这个对象，也是隐性的
    // return this;
};
const child = new Parent();
```

这应该不难理解，你应该在工作中看过类似下述代码中的操作，将this赋予一个新的变量(例如that)，最后返回这个变量：

```javascript
// ES5构造函数
let Parent = function (name, age) {
    let that = this;
    that.name = name;
    that.age = age;
    return that;
};
const child = new Parent('听风是风', '26');
```

为什么要这么写呢？我在前面说**this的创建与返回是隐性的**，但在工作中为了让构造过程更易可见与更易维护，所以才有了上述使用that代替this，同时手动返回that的做法；这也验证了隐性的这两步确实是存在的。

但上述这个解释我觉得不够完美，它只描述了构造器属性是如何塞给实例，没说原型上的属性是如何给实例继承的。

我在winter大神的重学前端专栏中，看到了比较符合我心意的，同时也是符合原理的描述：

> • 以构造器的prototype属性为原型，创建新对象；
>
> • 将this(也就是上一句中的新对象)和调用参数传给构造器，执行；
>
> • 如果构造器没有手动返回对象，则返回第一步创建的新对象，如果有，则舍弃掉第一步创建的新对象，返回手动return的对象。

到这里不管怎么说，你都应该大概知道了new过程中会**新建对象**，此对象会继承**构造器的原型与原型上的属性**，最后它会被**作为实例返回**这样一个过程。知道了原理，我们来手动实现一个简单的new方法。

# 实现一个简单的new方法

```javascript
// 构造器函数
let Parent = function (name, age) {
    this.name = name;
    this.age = age;
};
Parent.prototype.sayName = function () {
    console.log(this.name);
};
//自己定义的new方法
let newMethod = function (Parent, ...rest) {
    // 1.以构造器的prototype属性为原型，创建新对象；
    let child = Object.create(Parent.prototype);
    // 2.将this和调用参数传给构造器执行
    let result = Parent.apply(child, rest);
    // 3.如果构造器没有手动返回对象，则返回第一步的对象
    return typeof result  === 'object' ? result : child;
};
//创建实例，将构造函数Parent与形参作为参数传入
const child = newMethod(Parent, 'echo', 26);
child.sayName() //'echo';

//最后检验，与使用new的效果相同
child instanceof Parent//true
child.hasOwnProperty('name')//true
child.hasOwnProperty('age')//true
child.hasOwnProperty('sayName')//false
```





# new和括号结合优先级

　[优先级由高到低](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)：小括号(xxx) > 属性访问.  > new foo() > foo()  <span style="color:orange">不太赞同</span>

```javascript
function getName(){
    console.log(1)
}
function Foo() {
    this.getName = function () {
        console.log(2); 
    };
    return this;
}
Foo.getName = function () {
    console.log(3);
};
//先从.属性访问符号开始往前面找一个最近的对象，同时注意new Foo()优先于Foo();
var a=new Foo.getName();//3;属性.的优先级高于new foo()，所以===new (Foo.getName)();返回Foo.getName类型的实例
var b=new Foo().getName();//2;new foo()的优先级高于foo()，所以就相当于new foo()的属性，===(new Foo()).getName()；返回undefined
var c=new new Foo().getName();//2;new foo()优先级低于属性.，所以其实相当于就是new一个new foo()的getName属性函数，===new (new Foo().getName)();返回Foo.getName类型的实例


new Foo.getname() => new (Foo.getname)()
new Foo().getname() => (new Foo()).getname()
new new Foo().getname() => new (new Foo()).getname()
```