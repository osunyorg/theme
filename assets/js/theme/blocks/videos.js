/* eslint-disable no-underscore-dangle */
window.osuny = window.osuny || {};
window.osuny.VideoPlayerFactory = window.osuny.VideoPlayerFactory || {};
window.osuny.VideoPlayer = window.osuny.VideoPlayer || {};

window.osuny.VideoPlayer = function (element) {
    this.element = element;
    this.id = this.element.id;
    this.cover = this.element.querySelector('.lazy-video-player');

    if (!this.cover) {
        return;
    }

    this.button = this.cover.querySelector('button');
    this.iframe = this.element.querySelector('.video-container iframe');
    this.src = this.iframe.getAttribute('data-unloaded-src');

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

window.osuny.page.registerComponent({
    name: 'videoPlayer',
    selector: '.block-video',
    klass: window.osuny.VideoPlayer
});
