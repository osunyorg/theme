"use strict";

Number.prototype.decimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) {
        return 0;
    } else {
        return this.toString().split('.')[1].length || 0;
    }
};

Number.prototype.isInt = function () {
    return this % 1 === 0;
};
