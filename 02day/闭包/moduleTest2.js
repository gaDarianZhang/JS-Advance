

(function myModule(w){
    var msg = "this is my message";
    function inF1() {
        console.log(msg);
    }
    function inF2() {
        return msg;
    }
    // w.inF1 = inF1;
    // w.inF2 = inF2;
    w.myModuleObj = {
        inF1:inF1,
        inF2:inF2
    }
})(window)