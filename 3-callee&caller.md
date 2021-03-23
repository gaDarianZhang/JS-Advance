> 简单一点来说**`caller`是指向调用当前函数的函数**，比如b函数调用a函数，那么a.caller则是b的引用；<font color=orange>**callee是arguments的一个属性，指向其函数自身**</font>，比如在a函数中，arguments.callee就是a，这个特性可以用来计算正整数的阶乘，x*arguments.callee（x-1）也可以用来比较实参和形参，arguments.length和arguments.callee.length。



## claaee

```javascript
var a=function(){
    console.log(arguments.callee);
}
var b=function(){
    a()
}
b();
```
> 输出
>
> ```javascript
> ƒ (){
>         console.log(arguments.callee);
>     }
> ```

这个函数和a函数是不是一模一样？

<font size=4>callee返回正在执行的函数本身的引用。callee是arguments的一个属性，这个属性是一个指针，指向拥有这个arguments对象的函数。</font>

```
为了降低耦合性我们就用callee
```

```javascript
   function factorial(num){
        if(num<=1){
            return 1;
        }else{
            return num*arguments.callee(num-1);
        }
    }
```



## caller

```javascript
var a=function(){
    alert(a.caller);
}//定义一个函数。里面输出a.caller
var b=function(){
    a();
}//定义一个函数调用那个a函数；
b();//输出b函数体
```
```javascript
var a=function(){
    alert(a.caller);
}//定义一个函数。里面输出a.caller
var b=function(){
    a();
}//定义一个函数调用那个a函数；
a();//null(a在任何函数中被调用，即为顶层函数，输出的就是null)，上面的例子一中，a函数是在b中调用的所以不是顶层不反悔null，返回当前的调用就是b函数啦，而这个例子是在全局中调用的自然是null
```