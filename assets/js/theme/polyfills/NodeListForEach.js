if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, _thisArg) {
        var i = 0,
            thisArg = _thisArg || window;
        for (i = 0; i < this.length; i += 1) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}
