# 引

可以说this与闭包、原型链一样，属于JavaScript开发中老生常谈的问题了，百度一搜，this相关的文章铺天盖地。可开发好几年，被几道this题安排明明白白的人应该不在少数（我就是其一）。我觉得this概念抽象，变化多端总是让人晕头转向，但平心它并不是有多难，今天我们就从this绑定的<font color=red>**五种场景（默认绑定、隐式绑定、显式绑定、new绑定、箭头函数绑定）**</font>出发，静下心来好好聊聊这个 this，本文开始。

## 概总

1. 默认绑定：
    1. 注意函数嵌套，不要被迷惑。 
    2. 以及严格模式下的this
2. 隐式绑定：
    1. 连续多个.调用，只会找近邻的这个对象。对于对象内没有的属性，也是顺着原型链去找，而不是向上一层的对象中去找。
    2. 函数作为参数传递以及变量赋值，会导致this隐式丢失。
3. 显示绑定
4. new绑定
5. 箭头函数

# this默认绑定

this默认绑定我们可以理解为函数调用时无任何调用前缀的情景，它无法应对我们后面要介绍的另外四种情况，所以称之为默认绑定，默认绑定时this指向全局对象（**非严格模式**）：

```javascript
function fn1() {
    let fn2 = function () {
        console.log(this); //window
        fn3();
    };
    console.log(this); //window
    fn2();
};

function fn3() {
    console.log(this); //window
};

fn1();
```

这个例子中无论函数声明在哪，在哪调用，<span style="color:orange">由于函数调用时前面并未指定任何对象（没有.调用或者箭头函数或者call|apply），这种情况下this指向全局对象window。</span>

但需要注意的是，在严格模式环境中，默认绑定的this指向undefined，来看个对比例子：

```javascript
function fn() {
    console.log(this); //window
    console.log(this.name);
};

function fn1() {
    "use strict";
    console.log(this); //undefined
    console.log(this.name);
};

var name = '听风是风';

fn(); 
fn1() //TypeError: Cannot read property 'a' of undefined
```

再例如函数以及调用都暴露在严格模式中的例子：

```javascript
"use strict";
var name = '听风是风';
function fn() {
    console.log(this); //undefined
    console.log(this.name);//报错
};
fn();
```

<span style="color:orange;font-size:18px">最后一点，如果在严格模式下调用不在严格模式中的函数，并不会影响this指向</span>，来看最后一个例子：

```javascript
var name = '听风是风';
function fn() {
    console.log(this); //window
    console.log(this.name); //听风是风
};

(function () {
    "use strict";
    fn();
}());
```

# this隐式绑定

## 隐式绑定

什么是隐式绑定呢，如果函数调用时，前面存在调用它的对象，那么this就会隐式绑定到这个对象上，看个例子：

```javascript
function fn() {
    console.log(this.name);
};
let obj = {
    name: '听风是风',
    func: fn
};
obj.func() //听风是风
```

如果函数调用前存在多个对象，this指向距离调用自己最近的对象，比如这样：

```javascript
function fn() {
    console.log(this.name);
};
let obj = {
    name: '行星飞行',
    func: fn,
};
let obj1 = {
    name: '听风是风',
    o: obj
};
obj1.o.func() //行星飞行
```

那如果我们将obj对象的name属性注释掉，现在输出什么呢？

```javascript
function fn() {
    console.log(this.name);
};
let obj = {
    func: fn,
};
let obj1 = {
    name: '听风是风',
    o: obj
};
obj1.o.func() //？？
```

这里输出undefined，大家千万不要将作用域链和原型链弄混淆了，obj对象虽然obj1的属性，但它两原型链并不相同，并不是父子关系，由于obj未提供name属性，所以是undefined。

既然说到原型链，那我们再来点花哨的，我们再改写例子，看看下面输出多少：

```javascript
function Fn() {};
Fn.prototype.name = '时间跳跃';

function fn() {
    console.log(this.name);
};

let obj = new Fn();
obj.func = fn;

let obj1 = {
    name: '听风是风',
    o: obj
};
obj1.o.func() //?
```

这里输出时间跳跃，虽然obj对象并没有name属性，但顺着原型链，找到了产生自己的构造函数Fn，由于Fn原型链存在name属性，所以输出时间跳跃了。

### 作用域链与原型链的区别：

当访问一个变量时，解释器会先在当前作用域查找标识符，如果没有找到就去父作用域找，作用域链顶端是全局对象window，如果window都没有这个变量则报错。

当在对象上访问某属性时，首选会查找当前对象，如果没有就顺着原型链往上找，原型链顶端是null，如果全程都没找到则返一个undefined，而不是报错。

## 隐式丢失

在特定情况下会存在隐式绑定丢失的问题，最常见的就是<span style="color:orange; font-weight:bold">作为参数传递以及变量赋值</span>，先看参数传递：

```javascript
var name = '行星飞行';
let obj = {
    name: '听风是风',
    fn: function () {
        console.log(this.name);
    }
};

function fn1(param) {
    param();
};
fn1(obj.fn);//行星飞行
```

这个例子中我们将 obj.fn 也就是一个函数传递进 fn1 中执行，<span style="color:skyblue; font-size:18px; font-weight:bold">这里只是单纯传递了一个函数而已，this并没有跟函数绑在一起</span>，所以this丢失这里指向了window。

第二个引起丢失的问题是变量赋值，其实本质上与传参相同，看这个例子：

```javascript
var name = '行星飞行';
let obj = {
    name: '听风是风',
    fn: function () {
        console.log(this.name);
    }
};
let fn1 = obj.fn;
fn1(); //行星飞行
```

注意，<font color=skyblue size=4>**隐式绑定丢失并不是都会指向全局对象**</font>，比如下面的例子：

```javascript
var name = '行星飞行';
let obj = {
    name: '听风是风',
    fn: function () {
        console.log(this.name);
    }
};
let obj1 = {
    name: '时间跳跃'
}
obj1.fn = obj.fn;
obj1.fn(); //时间跳跃
```

虽然丢失了 obj 的隐式绑定，但是在赋值的过程中，又建立了新的隐式绑定，这里this就指向了对象 obj1。

# this显式绑定

显式绑定是指我们通过call、apply以及bind方法改变this的行为，相比隐式绑定，我们能清楚的感知 this 指向变化过程。来看个例子：

```javascript
let obj1 = {
    name: '听风是风'
};
let obj2 = {
    name: '时间跳跃'
};
let obj3 = {
    name: 'echo'
}
var name = '行星飞行';

function fn() {
    console.log(this.name);
};
fn(); //行星飞行
fn.call(obj1); //听风是风
fn.apply(obj2); //时间跳跃
fn.bind(obj3)(); //echo
```

比如在上述代码中，我们分别通过call、apply、bind改变了函数fn的this指向。

在js中，当我们调用一个函数时，我们习惯称之为函数调用，函数处于一个被动的状态；而call与apply让函数从被动变主动，函数能主动选择自己的上下文，所以这种写法我们又称之为函数应用。

注意，<font color=orange size=4>**如果在使用call之类的方法改变this指向时，指向参数提供的是null或者undefined，<span style="color:skyblue">那么 this 将指向全局对象。</span>**</font>

```javascript
let obj1 = {
    name: '听风是风'
};
let obj2 = {
    name: '时间跳跃'
};
var name = '行星飞行';

function fn() {
    console.log(this.name);
};
fn.call(undefined); //行星飞行
fn.apply(null); //行星飞行
fn.bind(undefined)(); //行星飞行
```

另外，在js API中部分方法也内置了显式绑定，以forEach为例：

```javascript
let obj = {
    name: '听风是风'
};

[1, 2, 3].forEach(function () {
    console.log(this.name);//听风是风*3
    console.log(this);//obj*3
}, obj);
```

### call、apply与bind区别

- call、apply与bind都用于改变this绑定，但call、apply在改变this指向的同时还会执行函数，而***bind在改变this后是返回一个全新的boundFcuntion绑定函数***，这也是为什么上方例子中bind后还加了一对括号 ()的原因。

- <font color=skyblue>**bind属于硬绑定，返回的 boundFunction 的 this 指向无法再次通过bind、apply或 call 修改**</font>；call与apply的绑定只适用当前调用，调用完就没了，下次要用还得再次绑。

- call与apply功能完全相同，唯一不同的是call方法传递函数调用形参是以散列形式，而apply方法的形参是一个数组。在传参的情况下，call的性能要高于apply，因为apply在执行时还要多一步解析数组。

描述一请参照上面已有例子。

描述二请参照下方例子，我们尝试修改 boundFunction 的 this 指向：

```javascript
let obj1 = {
    name: '听风是风'
};
let obj2 = {
    name: '时间跳跃'
};
var name = '行星飞行';

function fn() {
    console.log(this.name);
};
fn.call(obj1); //听风是风
fn(); //行星飞行
fn.apply(obj2); //时间跳跃
fn(); //行星飞行
let boundFn = fn.bind(obj1);
boundFn();//听风是风
boundFn.call(obj2);//听风是风
boundFn.apply(obj2);//听风是风
boundFn.bind(obj2)();//听风是风
```

描述三请参考以下例子：

```javascript
let obj = {
    name: '听风是风'
};

function fn(age,describe) {
    console.log(`我是${this.name},我的年龄是${age}，我非常${describe}!`);
};
fn.call(obj,'26','帅');//我是听风是风,我的年龄是26，我非常帅
fn.apply(obj,['26','帅']);//我是听风是风,我的年龄是26，我非常帅
```

更多关于call apply bind可以阅读博主这篇文章 [js中call、apply、bind到底有什么区别？bind返回的方法还能修改this指向吗？](https://www.cnblogs.com/echolun/p/11210659.html)

# new绑定

<span style="color:orange">准确来说，js中的构造函数只是使用new 调用的普通函数，它并不是一个类，最终返回的对象也不是一个实例，只是为了便于理解习惯这么说罢了。</span>

那么new一个函数究竟发生了什么呢，大致分为三步：

1. 以构造器的prototype属性为原型，创建新对象；

2. 将this(可以理解为上句创建的新对象)和调用参数传给构造器，执行；

3. 如果构造器没有手动返回对象，则返回第一步创建的对象

这个过程我们称之为构造调用，我们来看个例子：

```javascript
function Fn(){
    this.name = '听风是风';
};
let echo = new Fn();
echo.name//听风是风
```

在上方代码中，构造调用创建了一个新对象echo，而在函数体内，this将指向新对象echo上（可以抽象理解为新对象就是this）。

若对于new具体过程有疑惑，或者不知道怎么手动实现一个new 方法，可以阅读博主这篇文章 [js new一个对象的过程，实现一个简单的new方法](https://www.cnblogs.com/echolun/p/10903290.html)

# 箭头函数的this

ES6的箭头函数是另类的存在，为什么要单独说呢，这是因为箭头函数中的this不适用上面介绍的四种绑定规则。

准确来说，箭头函数中没有this，<span style="color:red">箭头函数的this指向取决于外层作用域中的this</span>，外层作用域或函数的this指向谁，箭头函数中的this便指向谁。有点吃软饭的嫌疑，一点都不硬朗，我们来看个例子：

```javascript
function fn() {
    return () => {
        console.log(this.name);
    };
}
let obj1 = {
    name: '听风是风'
};
let obj2 = {
    name: '时间跳跃'
};
let bar = fn.call(obj1); // fn this指向obj1
bar.call(obj2); //听风是风
```

为啥我们第一次绑定this并返回箭头函数后，再次改变this指向没生效呢？

前面说了，<span style="color: red; font-size:20px;font-weight:bolder">箭头函数的this取决于外层作用域的this，fn函数执行时this指向了obj1，所以箭头函数的this也指向obj1。除此之外，箭头函数this还有一个特性，那就是一旦箭头函数的this绑定成功，也无法被再次修改，有点硬绑定的意思。</span>

当然，箭头函数的this也不是真的无法修改，我们知道箭头函数的this就像作用域继承一样从上层作用域找，因此<span style="color: red; font-size:20px;font-weight:bolder">我们可以修改外层函数this指向达到间接修改箭头函数this的目的。</span>

```javascript
function fn() {
    return () => {
        console.log(this.name);
    };
};
let obj1 = {
    name: '听风是风'
};
let obj2 = {
    name: '时间跳跃'
};
fn.call(obj1)(); // fn this指向obj1,箭头函数this也指向obj1
fn.call(obj2)(); //fn this 指向obj2,箭头函数this也指向obj2
```

# this绑定优先级

我们先介绍前四种this绑定规则，那么问题来了，如果一个函数调用存在多种绑定方法，this最终指向谁呢？这里我们直接先上答案，this绑定优先级为：

显式绑定 > 隐式绑定 > 默认绑定

new绑定 > 隐式绑定 > 默认绑定

<font color=orange size=4>**箭头函数this不会受到显示绑定的影响**</font>

为什么显式绑定不和new绑定比较呢？因为不存在这种绑定同时生效的情景，如果同时写这两种代码会直接抛错，所以大家只用记住上面的规律即可。

```javascript
function Fn(){
    this.name = '听风是风';
};
let obj = {
    name:'行星飞行'
}
let echo = new Fn().call(obj);//报错 call is not a function
```

那么我们结合几个例子来验证下上面的规律，首先是显式大于隐式：

```javascript
//显式>隐式
let obj = {
    name:'行星飞行',
    fn:function () {
        console.log(this.name);
    }
};
obj1 = {
    name:'时间跳跃'
};
obj.fn.call(obj1);// 时间跳跃
```

其次是new绑定大于隐式：

```javascript
//new>隐式
obj = {
    name: '时间跳跃',
    fn: function () {
        this.name = '听风是风';
    }
};
let echo = new obj.fn();
echo.name;//听风是风
```

# 总

那么到这里，对于this的五种绑定场景就全部介绍完毕了，如果你有结合例子练习下来，我相信你现在对于this的理解一定更上一层楼了。

那么通过本文，我们知道默认绑定在严格模式与非严格模式下this指向会有所不同。

我们知道了隐式绑定与隐式丢失的几种情况，并简单复习了作用域链与原型链的区别。

相对隐式绑定改变的不可见，我们还介绍了显式绑定以及硬绑定，简单科普了call、apply与bind的区别，并提到当绑定指向为null或undefined时this会指向全局（非严格模式）。

我们介绍了new绑定以及new一个函数会发生什么。

最后我们了解了不太合群的箭头函数中的this绑定，了解到箭头函数的this由外层函数this指向决定，并有一旦绑定成功也无法再修改的特性。

