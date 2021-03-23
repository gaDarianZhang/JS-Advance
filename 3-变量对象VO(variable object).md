> 基于ES3理解，在ES5中很多内容已被修改
>
> 变量对象，在新版本中，准确的说法应该是<span style="color:orange">**环境记录对象**</span>，而环境记录对象，又区分**词法环境对象**与**变量环境对象**，词法环境对象用于解析当前上下文中，由 `const、let` 声明的标识符引用，变量环境对象用于解析由 `var `声明的标识符引用。执行上下文内部的实现逻辑过于复杂，并不利于理解，因此此处为了理解方便，仍然统一采用变量对象的说法。新版本的稍后再介绍。

# What

> 既然说执行上下文与变量是有关系的，那么执行上下文应该要知道变量存放在哪里和怎样获取变量。这种机制就称为**变量对象（variable object）**，简称VO。
>
> 在函数上下文中，使用活动对象 (activation object, AO) 来表示变量对象。活动对象和变量对象其实是一个东西，只有当进入一个执行环境时，这个执行上下文的变量对象才会被激活，此时称为 活动对象（AO），只有活动对象上的属性才能被访问。

变量对象是一个与执行上下文相关的特殊对象，它存储了在上下文中声明的：

- 函数形参arguments
- 函数声明
- 变量声明

# 创建变量对象

```javascript
function getName(name) {
    var b = 2;
    function foo() {};
    var bar = function() {};

}
getName('lucystar')
```

此时的 AO 大致如下:

```javascript
AO = {
    arguments: {
        0: 'lucystar',
        length: 1
    },
    foo: reference to function foo(){},
    name: 'lucystar',//这个在这里吗？？？暂且放着吧
    b: undefined,
    bar: undefined
}
```

## another example

```javascript
// demo01
function test(name) {
    console.log(a);
    console.log(foo());
	console.log(name);
    var a = 1;
    function foo() {
        return 2;
    }
}

test("zhangsan");
```

在上例中，我们直接从test()的执行上下文开始理解。全局作用域中运行test()时，test()的执行上下文开始创建。为了便于理解，我们用如下的形式来表示：

```javascript
// 执行上下文创建过程
testEC = {
    // 变量对象
    VO: {},
    scopeChain: {},
    this: window //创建阶段是不是不该有这个？？？
}

// 因为本文暂时不详细解释作用域链，所以把变量对象专门提出来说明

// VO 为 Variable Object的缩写，即变量对象
VO = {
    arguments: {...},  //注：在浏览器的展示中，函数的参数可能并不是放在arguments对象中，这里为了方便理解，我做了这样的处理
    foo: <foo reference>,  // 表示foo的地址引用
    name: "zhangsan", //创建阶段也不该有这个吧？？？
    a: undefined
}
```

未进入执行阶段之前，变量对象中的属性都不能访问！但是进入执行阶段之后，变量对象转变为了活动对象，里面的属性都能被访问了，然后开始进行执行阶段的操作。

> 这样，如果再面试的时候被问到变量对象和活动对象有什么区别，就又可以自如的应答了，他们其实都是同一个对象，只是处于执行上下文的不同生命周期。<span style="color:orange;font-size:20px;font-weight:600">不过只有处于函数调用栈栈顶的执行上下文中的变量对象，才会变成活动对象。</span>

```javascript
// 执行阶段
VO ->  AO   // Active Object
AO = {
    arguments: {...},
    foo: <foo reference>,
    name: "zhangsan",           
    a: 1,
    // this: Window //应该是在执行上下文中吧？？？？
}
```

# 变量对象在不同的执行上下文中的表现

在不同的执行上下文中，VO可能有不同的结构和名称，但在所有类型的执行上下文中，VO有一些操作和行为是相同的，比如变量的声明。从这个角度来看，将VO看成一个抽象的基本事物更容易理解， 函数执行上下文也可以通过VO定义一些相关的额外细节。

<font color=orange>**只有全局上下文允许通过VO的属性名称（window）间接访问VO，其他上下文是不能直接访问到VO的，VO是引擎内部的机制。至于全局上下文为什么能访问到，下面会讲。**</font>

## 全局执行上下文中的变量对象

> <font color=orange>**全局对象**</font>是一个在任何函数执行上下文还没推入执行栈之前就已经被创建的对象，这个对象只存在一份，在程序的任何地方都可以访问到该对象的属性。 它的生命周期随着程序的结束而结束。

在全局对象(global)创建的过程中，像Math、String、Date这些属性也会被初始化，甚至<font color=skyblue>**可以将全局对象的引用（window）作为它自身的属性**</font>。全局中的变量a是全局对象的属性，可以直接使用：console.log(a)。而在全局中，window和this等全局对象的引用也是直接使用，他们也是全局对象的属性。

例如在BOM中，全局对象的window属性指向全局对象， 所以可以理解为以下：

```javascript
global = {
  Math: <...>,
  String: <...>
  ...
  ...
  window: global
};
```

全局对象是不能通过名字直接访问的，所以当引用全局对象的属性的时候，一般都会将前缀省略掉。但可以通过全局执行上下文中的this去访问它， 同样也可以通过**引用自身**的属性去访问，比如BOM中的window属性，就是一个引用了全局对象自身的属性。

```javascript
String(10); // 应该是global.String(10)，前缀被省略了  
// with prefixes 
window.a = 10; // === global.window.a = 10 === global.a = 10; 
this.b = 20; // global.b = 20;
```

现在要告诉你的是，全局执行上下文的VO就是全局对象本身。也就是`VO(globalContext) === global`， 基于这个事实，对于在全局执行上下文中声明一个变量时，我们才可以通过全局对象的属性间接访问到这个变量，（例如我们事先不知道变量的名字）

> <span style="font-size:18px;font-weight:550">我的模糊理解：</span>
>
> 在函数的执行上下文中，包括了执行环境、变量对象、this和作用域链。里边的形参等变量都是在变量对象内保存。而对于全局环境来说，全局变量都应该在全局变量对象内保存，而这些全局变量又能被window访问，因此这个window就是全局变量对象。而window又是对自身的引用。

```javascript
var a = new String('test');
 
alert(a); // directly, is found in VO(globalContext): "test"
 
alert(window['a']); // indirectly via global === VO(globalContext): "test"
alert(a === this.a); // true
  
var aKey = 'a';
alert(window[aKey]); // indirectly, with dynamic property name: "test"
```

> <span style="color:#7195A2">上面的例子只是想证明一件事，就是为了能够访问到全局执行上下文的VO（一般的VO是不能直接访问的），就通过全局对象这个概念去访问VO， 而一般又不可以直接访问全局对象，只能通过全局对象的属性去访问，而全局对象的属性允许一个引用自身的值，这个值就是我们熟悉的window对象， 或者node实现的global对象，这个由厂商实现。</span>

<span style="color:#7195A2">**至于为什么要大费周章访问全局执行上下文的VO，还记得上面说过吗，VO存放着变量、函数声明、函数参数这些东西，如果访问不到VO，那就访问不到所有的变量、函数了， 所以才会暴露一个全局对象的概念去让我们访问到这些变量和函数。**</span>那么函数执行上下文又怎么访问VO，接着往下看。


## 函数执行上下文中的变量对象

> 函数执行上下文中的变量对象值不能直接访问到的，要用<font color=orange>活动对象</font>（activation object）去扮演VO的角色，简称AO。<font color=orange>`VO(functionContext) === AO`</font>

活动对象是在进入函数执行上下文的时候被创建的，它通过函数的arguments属性被初始化，arguments属性的值是Arguments Object，其实这个就是我们在函数里面常用的arguments属性，它的值是一个类数组对象，就叫Arguments Object。

<font color=orange>`arguments`</font>对象是AO的一个属性，它包括了以下的属性：

- callee：指向当前函数的引用；
- length：真正传递的参数的个数
- properties-indexes：也就是参数的索引

> 变量和函数声明没有了吗？？？？表示质疑！！！！！！！！！

```javascript
function foo(x, y, z) {
  
  // quantity of defined function arguments (x, y, z)
  alert(foo.length); // 3
 
  // quantity of really passed arguments (only x, y)
  alert(arguments.length); // 2
 
  // reference of a function to itself
  alert(arguments.callee === foo); // true
  
  // parameters sharing
 
  alert(x === arguments[0]); // true
  alert(x); // 10
  
  arguments[0] = 20;
  alert(x); // 20
  
  x = 30;
  alert(arguments[0]); // 30
  
  // however, for not passed argument z,
  // related index-property of the arguments
  // object is not shared
  
  z = 40;
  alert(arguments[2]); // undefined
  
  arguments[2] = 50;
  alert(z); // 40
  
}
  
foo(10, 20);

```

