//模拟JS分线程
onmessage = function (msg) {
    console.log("收到了来自主线程的数据:"+msg.data);
    var result = msg.data.toUpperCase();
    postMessage(result);
}
// var workerr = new Worker("./分线程.js");
// workerr.onmessage = function (msg) {
//     console.log("我在分线程1接受分线程2的数据："+msg.data);
// }