编写javascript代码的时候常常要判断变量，字面量的类型，可以用typeof，instanceof，Array.isArray()，等方法，究竟哪一种最方便，最实用，最省心呢？本问探讨这个问题。

# **1. typeof**

## **1.1 语法**

typeof返回一个字符串，表示未经计算的操作数的类型。

语法：typeof(operand) | typeof operand
参数：一个表示对象或原始值的表达式，其类型将被返回
描述：typeof可能返回的值如下：

| 类型                     | 结果           |
| ------------------------ | -------------- |
| Undefined                | “undefined”    |
| Null                     | “object”       |
| Boolean                  | “boolean”      |
| Number                   | “number”       |
| Bigint                   | “bigint”       |
| String                   | “string”       |
| Symbol                   | “symbol”       |
| 宿主对象（由JS环境提供） | 取决于具体实现 |
| Function对象             | “function”     |
| 其他任何对象             | “object”       |

从定义和描述上来看，这个语法可以判断出很多的数据类型，但是仔细观察，typeof null居然返回的是“object”，让人摸不着头脑，下面会具体介绍，先看看这个效果：

```javascript
    // 数值
    console.log(typeof 37) // number
    console.log(typeof 3.14) // number
    console.log(typeof(42)) // number
    console.log(typeof Math.LN2) // number
    console.log(typeof Infinity) // number
    console.log(typeof NaN) // number 尽管它是Not-A-Number的缩写，实际NaN是数字计算得到的结果，或者将其他类型变量转化成数字失败的结果
    console.log(Number(1)) //number Number(1)构造函数会把参数解析成字面量
    console.log(typeof 42n) //bigint
    // 字符串
    console.log(typeof '') //string
    console.log(typeof 'boo') // string
    console.log(typeof `template literal`) // string
    console.log(typeof '1') //string 内容为数字的字符串仍然是字符串
    console.log(typeof(typeof 1)) //string，typeof总是返回一个字符串
    console.log(typeof String(1)) //string String将任意值转换成字符串
    // 布尔值
    console.log(typeof true) // boolean
    console.log(typeof false) // boolean
    console.log(typeof Boolean(1)) // boolean Boolean会基于参数是真值还是虚值进行转换
    console.log(typeof !!(1)) // boolean 两次调用!!操作想短语Boolean()
    // Undefined
    console.log(typeof undefined) // undefined
    console.log(typeof declaredButUndefinedVariabl) // 未赋值的变量返回undefined
    console.log(typeof undeclaredVariable ) // 未定义的变量返回undefined
    // 对象
    console.log(typeof {a: 1}) //object
    console.log(typeof new Date()) //object
    console.log(typeof /s/) // 正则表达式返回object
    // 下面的例子令人迷惑，非常危险，没有用处，应避免使用，new操作符返回的实例都是对象
    console.log(typeof new Boolean(true)) // object
    console.log(typeof new Number(1)) // object
    console.log(typeof new String('abc')) // object
    // 函数
    console.log(typeof function () {}) // function
    console.log(typeof class C { }) // function
    console.log(typeof Math.sin) // function 
```

## **1.2 迷之null**

javascript诞生以来，typeof null都是返回‘object’的，这个是因为javascript中的值由两部分组成，一部分是表示**类型的标签**，另一部分是表示**实际的值**。对象类型的值类型标签是0，不巧的是null表示空指针，它的类型标签也被设计成0，于是就有这个typeof null === ‘object’这个‘恶魔之子’。

曾经有ECMAScript提案让typeof null返回‘null’，但是该提案被拒绝了。

## **1.3 使用new操作符**

除Function之外所有构造函数的类型都是‘object’，如下：

```javascript
    var str = new String('String');
    var num = new Number(100)
    console.log(typeof str) // object
    console.log(typeof num) // object
    var func = new Function()
    console.log(typeof func) // function 
```



## **1.4 语法中的括号**

typeof运算的优先级要高于“+”操作，但是低于圆括号

```javascript
    var iData = 99
    console.log(typeof iData + ' Wisen') // number Wisen
    console.log(typeof (iData + 'Wisen')) // string 
```

## **1.5 判断正则表达式的兼容性问题**

```javascript
typeof /s/ === 'function'; // Chrome 1-12 , 不符合 ECMAScript 5.1
typeof /s/ === 'object'; // Firefox 5+ , 符合 ECMAScript 5.1 
```

## **1.6 错误**

ECMAScript 2015之前，typeof总能保证对任何所给的操作数都返回一个字符串，即使是没有声明，没有赋值的标示符，typeof也能返回undefined，也就是说使用typeof永远不会报错。

但是ES6中加入了块级作用域以及let，const命令之后，在变量声明之前使用由let，const声明的变量都会抛出一个ReferenceError错误，块级作用域变量在块的头部到声明变量之间是“暂时性死区”，在这期间访问变量会抛出错误。如下：

```javascript
    console.log(typeof undeclaredVariable) // 'undefined'
    console.log(typeof newLetVariable) // ReferenceError
    console.log(typeof newConstVariable) // ReferenceError
    console.log(typeof newClass) // ReferenceError

    let newLetVariable
    const newConstVariable = 'hello'
    class newClass{} 
```

## **1.7 例外**

当前所有浏览器都暴露一个类型为undefined的非标准宿主对象document.all。typeof document.all === 'undefined'。景观规范允许为非标准的外来对象自定义类型标签，单要求这些类型标签与已有的不同，document.all的类型标签为undefined的例子在web领域被归类为对原ECMA javascript标准的“故意侵犯”，可能就是浏览器的恶作剧。

**总结**：typeof返回变量或者值的类型标签，虽然对大部分类型都能返回正确结果，但是对null，构造函数实例，正则表达式这三种不太理想。 

# **2. instanceof**

## **2.1 语法**

**instanceof运算符**用于检测实例对象（参数）的原型链上是否出现构造函数的prototype。

语法：object instanceof constructor
参数：object 某个实例对象
     constructor 某个构造函数
描述：instanceof运算符用来检测constructor.property是否存在于参数object的原型链上。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```javascript
// 定义构造函数
    function C() {
    }
    function D() {
    }
    var o = new C()
    console.log(o instanceof C) //true,因为Object.getPrototypeOf(0) === C.prototype
    console.log(o instanceof D) //false，D.prototype不在o的原型链上
    console.log(o instanceof Object) //true 同上

    C.prototype = {}
    var o2 = new C()
    console.log(o2 instanceof C) // true
    console.log(o instanceof C) // false C.prototype指向了一个空对象，这个空对象不在o的原型链上
    D.prototype = new C() // 继承
    var o3 = new D()
    console.log(o3 instanceof D) // true
    console.log(o3 instanceof C) // true C.prototype现在在o3的原型链上
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

需要注意的是，如果表达式obj instanceof Foo返回true，则并不意味着该表达式会永远返回true，应为Foo.prototype属性的值可能被修改，修改之后的值可能不在obj的原型链上，这时表达式的值就是false了。另外一种情况，改变obj的原型链的情况，虽然在当前ES规范中，只能读取对象的原型而不能修改它，但是借助非标准的__proto__伪属性，是可以修改的，比如执行obj.__proto__ = {}后，obj instanceof Foo就返回false了。此外ES6中Object.setPrototypeOf(),Reflect.setPrototypeOf()都可以修改对象的原型。

**instanceof和多全局对象（多个iframe或多个window之间的交互）**

浏览器中，javascript脚本可能需要在多个窗口之间交互。多个窗口意味着多个全局环境，不同全局环境拥有不同的全局对象，从而拥有不同的内置构造函数。这可能会引发一些问题。例如表达式[] instanceof window.frames[0].Array会返回false，因为Array.prototype !== window.frames[0].Array.prototype。

起初，这样可能没有意义，但是当在脚本中处理多个frame或多个window以及通过函数将对象从一个窗口传递到另一个窗口时，这就是一个非常有意义的话题。实际上，可以通过Array.isArray(myObj)或者Object.prototype.toString.call(myObj) = "[object Array]"来安全的检测传过来的对象是否是一个数组。

## **2.2 示例**

String对象和Date对象都属于Object类型（它们都由Object派生出来）。

但是，使用对象文字符号创建的对象在这里是一个例外，虽然原型未定义，但是instanceof of Object返回true。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```javascript
    var simpleStr = "This is a simple string";
    var myString  = new String();
    var newStr    = new String("String created with constructor");
    var myDate    = new Date();
    var myObj     = {};
    var myNonObj  = Object.create(null);

    console.log(simpleStr instanceof String); // 返回 false,虽然String.prototype在simpleStr的原型链上，但是后者是字面量，不是对象
    console.log(myString  instanceof String); // 返回 true
    console.log(newStr    instanceof String); // 返回 true
    console.log(myString  instanceof Object); // 返回 true

    console.log(myObj instanceof Object);    // 返回 true, 尽管原型没有定义
    console.log(({})  instanceof Object);    // 返回 true, 同上
    console.log(myNonObj instanceof Object); // 返回 false, 一种创建非 Object 实例的对象的方法

    console.log(myString instanceof Date); //返回 false

    console.log( myDate instanceof Date);     // 返回 true
    console.log(myDate instanceof Object);   // 返回 true
    console.log(myDate instanceof String);   // 返回 false 
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

**注意：**instanceof运算符的左边必须是一个对象，像"string" instanceof String，true instanceof Boolean这样的字面量都会返回false。

下面代码创建了一个类型Car，以及该类型的对象实例mycar，instanceof运算符表明了这个myca对象既属于Car类型，又属于Object类型。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```javascript
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
var mycar = new Car("Honda", "Accord", 1998);
var a = mycar instanceof Car;    // 返回 true
var b = mycar instanceof Object; // 返回 true 
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

**不是...的实例**

要检测对象不是某个构造函数的实例时，可以使用!运算符，例如if(!(mycar instanceof Car))

instanceof虽然能够判断出对象的类型，但是必须要求这个参数是一个对象，简单类型的变量，字面量就不行了，很显然，这在实际编码中也是不够实用。

**总结**：obj instanceof constructor虽然能判断出对象的原型链上是否有构造函数的原型，但是只能判断出对象类型变量，字面量是判断不出的。

# **3. Object.prototype.toString()**

## **3.1. 语法**

toString()方法返回一个表示该对象的字符串。

语法：obj.toString()
返回值：一个表示该对象的字符串
描述：每个对象都有一个toString()方法，该对象被表示为一个文本字符串时，或一个对象以预期的字符串方式引用时自动调用。默认情况下，toString()方法被每个Object对象继承，如果此方法在自定义对象中未被覆盖，toString()返回“[object type]”，其中type是对象的类型，看下面代码：

```javascript
    var o = new Object();
    console.log(o.toString()); // returns [object Object] 
```

注意：如ECMAScript 5和随后的Errata中所定义，从javascript1.8.5开始，toString()调用null返回[object, Null]，undefined返回[object Undefined]

## **3.2. 示例**

**覆盖默认的toString()方法**

可以自定义一个方法，来覆盖默认的toString()方法，该toString()方法不能传入参数，并且必须返回一个字符串，自定义的toString()方法可以是任何我们需要的值，但如果带有相关的信息，将变得非常有用。

下面代码中定义Dog对象类型，并在构造函数原型上覆盖toString()方法，返回一个有实际意义的字符串，描述当前dog的姓名，颜色，性别，饲养员等信息。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```javascript
function Dog(name,breed,color,sex) {
        this.name = name;
        this.breed = breed;
        this.color = color;
        this.sex = sex;
    }
    Dog.prototype.toString = function dogToString() {
        return "Dog " + this.name + " is a " + this.sex + " " + this.color + " " + this.breed
    }

    var theDog = new Dog("Gabby", "Lab", "chocolate", "female");
    console.log(theDog.toString()) //Dog Gabby is a female chocolate Lab 
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

# **4. 使用toString()检测数据类型**

目前来看toString()方法能够基本满足javascript数据类型的检测需求，可以通过toString()来检测每个对象的类型。为了每个对象都能通过Object.prototype.toString()来检测，需要以Function.prototype.call()或者Function.prototype.apply()的形式来检测，传入要检测的对象或变量作为第一个参数，返回一个字符串"[object type]"。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```javascript
    // null undefined
    console.log(Object.prototype.toString.call(null)) //[object Null] 很给力
    console.log(Object.prototype.toString.call(undefined)) //[object Undefined] 很给力

    // Number
    console.log(Object.prototype.toString.call(Infinity)) //[object Number]
    console.log(Object.prototype.toString.call(Number.MAX_SAFE_INTEGER)) //[object Number]
    console.log(Object.prototype.toString.call(NaN)) //[object Number]，NaN一般是数字运算得到的结果，返回Number还算可以接受
    console.log(Object.prototype.toString.call(1)) //[object Number]
    var n = 100
    console.log(Object.prototype.toString.call(n)) //[object Number]
    console.log(Object.prototype.toString.call(0)) // [object Number]
    console.log(Object.prototype.toString.call(Number(1))) //[object Number] 很给力
    console.log(Object.prototype.toString.call(new Number(1))) //[object Number] 很给力
    console.log(Object.prototype.toString.call('1')) //[object String]
    console.log(Object.prototype.toString.call(new String('2'))) // [object String]

    // Boolean
    console.log(Object.prototype.toString.call(true)) // [object Boolean]
    console.log(Object.prototype.toString.call(new Boolean(1))) //[object Boolean]

    // Array
    console.log(Object.prototype.toString.call(new Array(1))) // [object Array]
    console.log(Object.prototype.toString.call([])) // [object Array]

    // Object
    console.log(Object.prototype.toString.call(new Object())) // [object Object]
    function foo() {}
    let a = new foo()
    console.log(Object.prototype.toString.call(a)) // [object Object]

    // Function
    console.log(Object.prototype.toString.call(Math.floor)) //[object Function]
    console.log(Object.prototype.toString.call(foo)) //[object Function]

    // Symbol
    console.log(Object.prototype.toString.call(Symbol('222'))) //[object Symbol]

    // RegExp
    console.log(Object.prototype.toString.call(/sss/)) //[object RegExp] 
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

上面的结果，除了NaN返回Number稍微有点差池之外其他的都返回了意料之中的结果，都能满足实际开发的需求，于是我们可以写一个通用的函数来检测变量，字面量的类型。如下：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```javascript
    let Type = (function () {
        let type = {};
        let typeArr = ['String', 'Object', 'Number', 'Array', 'Undefined', 'Function', 'Null', 'Symbol', 'Boolean', 'RegExp', 'BigInt'];
        for (let i = 0; i < typeArr.length; i++) {
            (function (name) {
                type['is' + name] = function (obj) {
                    return Object.prototype.toString.call(obj) === '[object ' + name + ']'
                }
            })(typeArr[i])
        }
        return type
    })()
    let s = true
    console.log(Type.isBoolean(s)) // true
    console.log(Type.isRegExp(/22/)) // true 
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

除了能检测ECMAScript规定的八种数据类型（七种原始类型，**Boolean**，**Null**，**Undefined**，**Number**，**BigInt**，**String**，**Symbol**，一种复合类型**Object**）之外，还能检测出正则表达式**RegExp**，**Function**这两种类型，基本上能满足开发中的判断数据类型需求。

# **5. 判断相等**

既然说道这里，不妨说一说另一个开发中常见的问题，判断一个变量是否等于一个值。ES5中比较两个值是否相等，可以使用相等运算符（==），严格相等运算符（===），但它们都有缺点，== 会将‘4’转换成4，后者NaN不等于自身，以及+0 !=== -0。ES6中提出”Same-value equality“（同值相等）算法，用来解决这个问题。Object.is就是部署这个算法的新方法，它用来比较两个值是否严格相等，与严格比较运算（===）行为基本一致。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```javascript
    console.log(5 == '5') // true
    console.log(NaN == NaN) // false
    console.log(+0 == -0) // true
    console.log({} == {}) // false

    console.log(5 === '5') // false
    console.log(NaN === NaN) // false
    console.log(+0 === -0) // true
    console.log({} === {}) // false
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

Object.js()不同之处有两处，一是+0不等于-0，而是NaN等于自身，如下：

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```javascript
    let a = {}
    let b = {}
    let c = b
    console.log(a === b) // false
    console.log(b === c) // true
    console.log(Object.is(b, c)) // true 
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

注意两个空对象不能判断相等，除非是将一个对象赋值给另外一个变量，对象类型的变量是一个指针，比较的也是这个指针，而不是对象内部属性，对象原型等。