var num = 0;
var timer2 = setInterval(function () {
    num++;
    postMessage("timer2:"+num*3+"s");
},3000);