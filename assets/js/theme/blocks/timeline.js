const timelines = document.querySelectorAll('.block-timeline--horizontal');

class BlockTimeline {
    constructor (block) {
        this.block = block;
        this.content = this.block.querySelector('.timeline');
        this.list = this.block.querySelector('.timeline-events ol');
        this.items = this.list.querySelectorAll('.timeline-event');
        this.previous = this.block.querySelector('.previous');
        this.next = this.block.querySelector('.next');
        this.isManipulated = false;

        this.index = 0;

        this.listen();
        this.resize();
        this.goTo(0);
    }

    listen () {
        window.addEventListener('resize', this.resize.bind(this));

        this.items.forEach((item, i) => {
            item.addEventListener('click', this.onClickItem.bind(this, i));
        });

        if (this.previous && this.next) {
            this.handleArrows();
        }

        this.handlePointers();
    }

    resize () {
        let maxTitleHeight = 0;

        this.block.style = '';

        this.itemWidth = this.items[0].offsetWidth;

        this.items.forEach((item) => {
            maxTitleHeight = Math.max(item.querySelector('.title').offsetHeight, maxTitleHeight);
        });

        this.block.style.setProperty('--min-title-height', maxTitleHeight + 'px');
        this.update();
    }

    onClickItem(i) {
        if (!this.isManipulated) {
            this.goTo(i);
        }
    }

    handleArrows () {
        this.previous.addEventListener('click', () => {
            this.goTo(this.index-1);
        });
        this.next.addEventListener('click', () => {
            this.goTo(this.index+1);
        });
    }

    handlePointers () {
        let endEvents = ['pointerup'],
            startX,
            endX,
            threshold = 30,
            isPointerDown = false;

        this.content.style.touchAction = 'pan-y';

        this.content.addEventListener('pointerdown', (event) => {
            this.content.classList.add('is-grabbing');
            startX = event.clientX;
            isPointerDown = true;
        });

        this.content.addEventListener('pointermove', (event) => {
            this.isManipulated = isPointerDown;
            endX = event.clientX;
        });

        endEvents.forEach(event => {
            this.content.addEventListener(event, (event) => {
                isPointerDown = false;
                this.onManipulationEnd(startX, endX, threshold);
            });
        });
    }

    onManipulationEnd (start, end, threshold) {
        if (start > end + threshold) {
            this.goTo(this.index+1);
        } else if (start < end - threshold) {
            this.goTo(this.index-1);
        }

        this.content.classList.remove('is-grabbing');

        // Add delay to avoid conflict with item clicked
        setTimeout(() => {
            this.isManipulated = false;
        }, 100);
    }

    goTo (_index) {
        this.index = Math.min(Math.max(_index, 0), this.items.length-1);
        this.update();
    }

    update () {
        this.list.style.marginLeft = `${-this.index * this.itemWidth}px`;

        this.items.forEach((item, index) => {
            if (index < this.index) {
                item.classList.add('is-passed');
            } else {
                item.classList.remove('is-passed');
            }
        });

        if (this.previous && this.next) {
            this.previous.disabled = this.index === 0;
            this.next.disabled = this.index === this.items.length - 1;
        }
    }
}

timelines.forEach((timeline) => {
    new BlockTimeline(timeline);
});
