window.osuny = window.osuny || {};

window.osuny.utils = {
    findElementByClassName: function (element, className) {
        return element.getElementsByClassName(className).item(0);
    }
}