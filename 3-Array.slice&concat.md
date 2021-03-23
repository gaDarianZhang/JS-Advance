## [使用slice和concat对数组的深拷贝和浅拷贝](https://www.cnblogs.com/baiyangyuanzi/p/6518218.html)

## 数组浅拷贝

在使用JavaScript对数组进行操作的时候，我们经常需要将数组进行备份.

如下代码，如果只是简单才用赋值的方法，那么我们只要更改其中的任何一个，然后其他的也会跟着改变，这就导致了问题的发生

```javascript
var arr1 = ["red","yellow","black"];
var arr2 = arr1;
arr2[1] = "green";
console.log("数组的原始值：" + arr1 );
console.log("数组的新值：" + arr2);
测试结果如下
```

![img](https://images2015.cnblogs.com/blog/1118847/201703/1118847-20170308095253172-141799910.png)

 

像上面的这种直接赋值的方式就是数组的浅拷贝，浅拷贝改变其中一个数组，另外一个数组也会跟着改变。很多时候，这不是我们想要的。

## 数组深拷贝方法

**（1）js的slice方法**

```
对于array对象的slice函数，返回一个数组的一段。（仍为数组）
arrayObj.slice(start, [end])
参数：
arrayObj 必选项。一个 Array 对象。
start 必选项。arrayObj 中所指定的部分的开始元素是从零开始计算的下标。
end可选项。arrayObj 中所指定的部分的结束元素是从零开始计算的下标。
说明：
slice 方法返回一个 Array 对象，其中包含了 arrayObj 的指定部分。
slice 方法一直复制到 end 所指定的元素，但是不包括该元素。
如果 start 为负，将它作为 length + start处理，此处 length 为数组的长度。
如果 end 为负，就将它作为 length + end 处理，此处 length 为数组的长度。
如果省略 end ，那么 slice 方法将一直复制到 arrayObj 的结尾。
如果 end 出现在 start 之前，不复制任何元素到新数组中。
```

测试例子：

```javascript
var arr1 = ["1","2","3"];
var arr2 = arr1.slice(0);
arr2[1] = "9";
console.log("数组的原始值：" + arr1 );
console.log("数组的新值：" + arr2 );
```

测试结果：

![img](https://images2015.cnblogs.com/blog/1118847/201703/1118847-20170308101826719-1282220973.png)

如测试结果显示，通过JS的slice方法，改变拷贝出来的数组的某项值后，对原来数组没有任何影响。

**（2）js的concat方法**

```
concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。
语法：arrayObject.concat(arrayX,arrayX,......,arrayX)
说明：返回一个新的数组。该数组是通过把所有 arrayX 参数添加到 arrayObject 中生成的。如果要进行 concat() 操作的参数是数组，那么添加的是数组中的元素，而不是数组。
```

测试例子:

```javascript
var arr1 = ["1","2","3"];
var arr2 = arr1.concat();
arr2[1] = "9";
console.log("数组的原始值：" + arr1 );
console.log("数组的新值：" + arr2 );
```

测试结果:

![img](https://images2015.cnblogs.com/blog/1118847/201703/1118847-20170308102548031-992402178.png)

如测试结果显示，通过JS的concat方法，改变拷贝出来的数组的某项值后，对原来数组没有任何影响。

**(3)js遍历数组的方法**

测试例子：

```javascript
var arr1 = [1,2,3];//原来数组
var arr2 = [];//新数组

function deepCopy(arry1, arry2){
　　var length = arry1.length;
　　for(var i = 0;i<length;i++){
　　　　arry2[i] = arry1[i];
　　}
}

deepCopy(arr1, arr2);
arr2[0] =5;
console.log(arr1);
console.log(arr2);
```

测试结果：

![img](https://images2015.cnblogs.com/blog/1118847/201703/1118847-20170308110356578-909975471.png)

 

## slice,concat方法的局限性

测试例子1

```javascript
var arr1 = [{"name":"weifeng"},{"name":"boy"}];//原数组
var arr2 = [].concat(arr1);//拷贝数组
arr1[1].name="girl";
console.log(arr1);// [{"name":"weifeng"},{"name":"girl"}]
console.log(arr2);//[{"name":"weifeng"},{"name":"girl"}]
```

测试结果：

![img](https://images2015.cnblogs.com/blog/1118847/201703/1118847-20170308141956766-1597438894.png)

 

测试例子2

```javascript
var a1=[["1","2","3"],"2","3"],a2;
a2=a1.slice(0);
a1[0][0]=0; //改变a1第一个元素中的第一个元素
console.log(a2[0][0]);  //影响到了a2

var b1=[["1","2","3"],"2","3"],b2;
b2=b1.slice(0);
b1[0][0]=0; //改变a1第一个元素中的第一个元素
console.log(b2[0][0]);  //影响到了a2
```

测试结果：

![img](https://images2015.cnblogs.com/blog/1118847/201703/1118847-20170308142214063-1416094394.png)

 

从上面两个例子可以看出，由于数组内部属性值为引用对象，因此使用slice和concat对对象数组的拷贝，整个拷贝还是浅拷贝，拷贝之后数组各个值的指针还是指向相同的存储地址。

因此，slice和concat这两个方法，仅适用于对不包含引用对象的一维数组的深拷贝