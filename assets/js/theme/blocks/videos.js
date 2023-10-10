// function stopThis(){
//     var iframe = container.getElementsByTagName("iframe")[0];
//     var url = iframe.getAttribute('src');
//     iframe.setAttribute('src', '');
//     iframe.setAttribute('src', url);
// }

const videos = document.querySelectorAll('.block-video');

class videoPlayer {
    constructor (dom) {
        this.dom = dom;
        
        this.player = this.dom.querySelector('.video-player');
        this.playBtn = this.player.querySelector('.video-player__play');
        this.videoContainer = this.dom.querySelector('.video-container');
        this.videoIframe = this.videoContainer.querySelector('iframe');
        this.videoUrl = this.videoContainer.getAttribute('data-url');
        
        this.listen();
    }
    listen () {
        this.playBtn.addEventListener('click', () => {
            this.playVideo();
        });
    }
    playVideo() {
        this.player.style.display = 'none';
        this.videoIframe.src = this.videoUrl;
    }
}

videos.forEach((dom) => {
    new videoPlayer(dom);
});