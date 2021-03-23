# What

> **执行上下文（Execution content）**就是当前 JavaScript 代码被解析和执行时所在环境的抽象概念， JavaScript 中运行任何的代码都是在执行上下文中运行。简称EC

# 执行上下文分类

+ <font color=orange>**全局执行上下文：** </font>这是默认的、最基础的执行上下文。不在任何函数中的代码都位于全局执行上下文中。它做了两件事：1. 创建一个全局对象，在浏览器中这个全局对象就是 window 对象。2. 将 `this` 指针指向这个全局对象。一个程序中只能存在一个全局执行上下文。

- <font color=orange>**函数执行上下文：**</font> 每次调用函数时，都会为该函数创建一个新的执行上下文。每个函数都拥有自己的执行上下文，但是只有在函数被调用的时候才会被创建。一个程序中可以存在任意数量的函数执行上下文。每当一个新的执行上下文被创建，它都会按照特定的顺序执行一系列步骤，具体过程将在本文后面讨论。

- <font color=orange>**Eval 函数执行上下文：**</font> 运行在 `eval` 函数中的代码也获得了自己的执行上下文，但由于 JavaScript 开发人员不常用 `eval` 函数，所以在这里不再讨论。

# 执行上下文栈

> <font color=orange>**执行上下文栈/执行栈**</font>是用来管理执行上下文的。在执行上下文创建好后，JavaScript引擎会将执行上下文压入到栈中，通常把这种用来管理执行上下文的栈称为执行上下文栈，又称<span style="color:skyblue">**调用栈**，浏览器调试模式中的Call Stack中存储的就是调用栈&执行上下文栈</span>。

当 JavaScript 引擎首次读取你的脚本时，它会创建一个全局执行上下文并将其推入当前的执行栈。每当发生一个函数调用，引擎都会为该函数创建一个新的执行上下文并将其推到当前执行栈的顶端。

引擎会运行执行上下文在执行栈顶端的函数，当此函数运行完成后，其对应的执行上下文将会从执行栈中弹出，上下文控制权将移到当前执行栈的下一个执行上下文。

```javascript
let a = 'javascript';

function foo() {
    console.log('foo');
    bar();
}
function bar() {
    console.log('bar');
}
foo();
```

![preview](https://segmentfault.com/img/remote/1460000023216558/view)

> 为什么基本数据类型存储在栈中，引用数据类型存储在堆中？<span style="color:#295A83">JavaScript引擎需要用栈来维护程序执行期间的上下文的状态，如果栈空间大了的话，所有数据都存放在栈空间里面，会影响到上下文切换的效率，进而影响整个程序的执行效率。</span>

# 生命周期

- 创建阶段
- 执行阶段
- 销毁阶段



> > > ES3的执行上下文

每个执行上下文有三个重要属性：

- 变量对象VO
- 作用域链scope chain
- this



> > > ES5及以后

<img src="./执行上下文(Execution content).assets/image-20201203125723461.png" style="transform: rotate(0deg) translateX(0px); zoom: 150%;">

# 执行上下文的创建

到目前为止，我们已经看到了 JavaScript 引擎如何管理执行上下文，现在就让我们来理解 JavaScript 引擎是如何创建执行上下文的。

执行上下文分两个阶段创建：<font color=orange>**1）创建阶段；** **2）执行阶段**</font>

## 创建阶段

在任意的 JavaScript 代码被执行前，执行上下文处于创建阶段。在创建阶段中总共发生了三件事情：

1. 确定 **this** 的值，也被称为 **This Binding**。
2. **LexicalEnvironment（词法环境）** 组件被创建。
3. **VariableEnvironment（变量环境）** 组件被创建。

因此，执行上下文可以在概念上表示如下：

```javascript
ExecutionContext = {  
  ThisBinding = <this value>,  
  LexicalEnvironment = { ... },  
  VariableEnvironment = { ... },  
}
```

### this Binding

在全局执行上下文中，`this` 的值指向全局对象，在浏览器中，`this` 的值指向 window 对象。

在函数执行上下文中，`this` 的值取决于函数的调用方式。如果它被一个对象引用调用，那么 `this` 的值被设置为该对象，否则 `this` 的值被设置为全局对象或 `undefined`（严格模式下）。例如：

```javascript
let person = {  
  name: 'peter',  
  birthYear: 1994,  
  calcAge: function() {  
    console.log(2018 - this.birthYear);  
  }  
}

person.calcAge();   
// 'this' 指向 'person', 因为 'calcAge' 是被 'person' 对象引用调用的。

let calculateAge = person.calcAge;  
calculateAge();  
// 'this' 指向全局 window 对象,因为没有给出任何对象引用
```

### <font color=orange>词法环境</font>

[官方 ES6](http://ecma-international.org/ecma-262/6.0/) 文档将词法环境定义为：

> 词法环境是一种规范类型，基于 ECMAScript 代码的词法嵌套结构来定义标识符与特定变量和函数的关联关系。词法环境由环境记录（environment record）和可能为空引用（null）的外部词法环境组成。

简而言之，词法环境是一个包含**标识符变量映射**的结构。（这里的**标识符**表示变量/函数的名称，**变量**是对实际对象【包括函数类型对象】或原始值的引用）

在词法环境中，有两个组成部分：<font color=orange>（1）**环境记录（environment record）** （2）**对外部环境的引用**</font>

- **环境记录**是存储变量和函数声明的实际位置。

- **对外部环境的引用**意味着它可以访问其外部词法环境。

**词法环境**有<font color=orange size=4>**两种类型**</font>：

- **全局环境**（在全局执行上下文中）是一个没有外部环境的词法环境。全局环境的外部环境引用为 **null**。它拥有一个全局对象（window 对象）及其关联的方法和属性（例如数组方法）以及任何用户自定义的全局变量，`this` 的值指向这个全局对象。
- **函数环境**，用户在函数中定义的变量被存储在**环境记录**中。对外部环境的引用可以是全局环境，也可以是包含内部函数的外部函数环境。

**注意：** 对于<font color=orange>**函数环境**而言，**环境记录** 还包含了一个 `arguments` 对象</font>，该对象包含了索引和传递给函数的参数之间的映射以及传递给函数的参数的**长度（数量）**。例如，下面函数的 `arguments` 对象如下所示：

```javascript
function foo(a, b) {  
  var c = a + b;  
}  
foo(2, 3);

// arguments 对象  
Arguments: {0: 2, 1: 3, length: 2},

```

<font color=orange>**环境记录** </font>同样有两种类型（如下所示）：

- **声明性环境记录** 存储变量、函数和参数。一个函数环境包含声明性环境记录。**==>函数环境**
- **对象环境记录** 用于定义在全局执行上下文中出现的变量和函数的关联。全局环境包含对象环境记录。   **==>全局环境**

抽象地说，词法环境在伪代码中看起来像这样：

```javascript
//全局执行上下文的词法环境
GlobalExectionContext = {  
  LexicalEnvironment: {  //词法环境
    EnvironmentRecord: { //环境记录--》全局的对象环境记录 
      Type: "Object",  
      // 标识符绑定在这里 
      ...  
    } 
    outer: <null>  //外部环境引用
}
//函数执行上下的词法环境
FunctionExectionContext = {  
  LexicalEnvironment: {  //词法环境
    EnvironmentRecord: { //环境记录--》函数的声明性环境记录 
      Type: "Declarative",  
      // 标识符绑定在这里 
      ...
    } 
    outer: <Global or outer function environment reference>  //外部环境引用
}
```

### <font color=orange>变量环境</font>

它也是一个词法环境，其 `EnvironmentRecord` 包含了由  **VariableStatements（变量声明）** 在此执行上下文创建的绑定。

如上所述，变量环境也是一个词法环境，因此**<font color=orange size=4>变量环境具有上面定义的词法环境的所有属性</font>**。

在 ES6 中，**`LexicalEnvironment`** 组件和 **`VariableEnvironment`** 组件的**<font color=orange size=4>区别</font>**在于前者用于存储<font color=skyblue>函数声明、`let/const`变量（ `let` 和 `const` ）【以及函数环境中的Arguments】绑定</font>，而后者仅用于存储<font color=skyblue>`var`变量（ `var` ）绑定</font>。

让我们结合一些代码示例来理解上述概念：

```javascript
let a = 20;  
const b = 30;  
var c;

function multiply(e, f) {  
 var g = 20;  
 return e * f * g;  
}

c = multiply(20, 30);
```

执行上下文如下所示：

```javascript
GlobalExectionContext = {

  ThisBinding: <Global Object>,

  LexicalEnvironment: {  
    EnvironmentRecord: {  
      Type: "Object",  
      // 标识符绑定在这里  
      a: < uninitialized >,  
      b: < uninitialized >,  
      multiply: < func >  
    }  
    outer: <null>  
  },

  VariableEnvironment: {  
    EnvironmentRecord: {  
      Type: "Object",  
      // 标识符绑定在这里  
      c: undefined,  
    }  
    outer: <null>  
  }  
}

FunctionExectionContext = {  
   
  ThisBinding: <Global Object>,

  LexicalEnvironment: {  
    EnvironmentRecord: {  
      Type: "Declarative",  
      // 标识符绑定在这里  
      Arguments: {0: 20, 1: 30, length: 2},  
    },  
    outer: <GlobalLexicalEnvironment>  
  },

  VariableEnvironment: {  
    EnvironmentRecord: {  
      Type: "Declarative",  
      // 标识符绑定在这里  
      g: undefined  
    },  
    outer: <GlobalLexicalEnvironment>  
  }  
}
```

## 执行阶段

这是整篇文章中最简单的部分。在此阶段，完成对所有变量的分配，最后执行代码。

**注：** 在执行阶段，如果 JavaScript 引擎在源代码中声明的实际位置找不到 `let` 变量的值（也就是只是用let声明变量，但声明的时候没有赋值），那么将为其分配 `undefined` 值。



# ES3&ES5

变量对象与活动对象的概念是ES3提出的老概念，从ES5开始就用词法环境和变量环境替代了，因为更好解释。

在上文中，我们通过介绍词法环境与变量环境解释了为什么var会存在变量提升，为什么let const提升后不能直接使用。而通过变量对象与活动对象是很难解释的，由其是在JavaScript在更新中不断在弥补当初设计的坑。

其次，词法环境的概念与变量对象这类概念也是可以对应上的。

我们知道变量对象与活动对象其实都是变量对象，变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。而在函数上下文中，我们用活动对象(activation object, AO)来表示变量对象。

那这不正好对应到了全局词法记录与函数词法记录了吗。而且由于ES6新增的let const不存在变量提升，于是正好有了词法环境与变量环境的概念来解释这个问题。

所以说到这，你也不用为词法环境，变量对象的概念闹冲突了。