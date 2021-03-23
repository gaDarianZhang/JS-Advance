function myModule() {
    var msg = "this is my message";
    function inF1() {
        console.log(msg);
    }
    function inF2() {
        return msg;
    }
    return {inF1:inF1,inF2:inF2};
}