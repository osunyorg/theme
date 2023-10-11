const videos = document.querySelectorAll('.block-video');

class videoPlayer {
    constructor (dom) {
        this.dom = dom;
        
        this.player = this.dom.querySelector('.lazy-video-player');
        if (this.player) {
            this.playBtn = this.player.querySelector('button');
        }
        else {
            return;
        }
        this.videoIframe = this.dom.querySelector('.video-container iframe');
        this.videoSrc = this.videoIframe.getAttribute('data-unloaded-src');

        console.log(this.dom)
        
        this.listen();
    }
    listen () {
        this.playBtn.addEventListener('click', () => {
            this.playVideo();
        });
    }
    playVideo() {
        this.player.style.display = 'none';
        this.videoIframe.src = this.videoSrc;
    }
}

videos.forEach((dom) => {
    new videoPlayer(dom);
});