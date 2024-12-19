/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.VideoPlayerFactory = window.osuny.VideoPlayerFactory || {};
window.osuny.VideoPlayer = window.osuny.VideoPlayer || {};

window.osuny.VideoPlayer = function (element) {
    this.element = element;
    this.cover = this.element.querySelector('.lazy-video-player');

    if (!this.cover) {
        return;
    }

    this.button = this.cover.querySelector('button');
    this.iframe = this.element.querySelector('.video-container iframe');
    this.src = this.iframe.getAttribute('data-unloaded-src');

    this.listen();
};

window.osuny.VideoPlayer.prototype.listen = function () {
    this.button.addEventListener('click', this.play.bind(this));
};

window.osuny.VideoPlayer.prototype.play = function () {
    this.cover.style.display = 'none';
    this.iframe.src = this.src;
};

window.osuny.VideoPlayer.prototype.cloneIframe = function () {
    var clone = this.iframe.cloneNode();
    clone.src = this.src;
    return clone;
};

window.osuny.VideoPlayerFactory = function () {
    var elements = document.querySelectorAll('.block-video');
    this.videos = {};

    elements.forEach(function (element) {
        this.videos[element.id] = new window.osuny.VideoPlayer(element);
    }.bind(this));
};

window.osuny.VideoPlayerFactory.prototype.get = function (id) {
    return this.videos[id];
};

window.osuny.videoPlayerFactory = new window.osuny.VideoPlayerFactory();
