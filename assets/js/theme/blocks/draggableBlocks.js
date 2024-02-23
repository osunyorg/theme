const draggableBlocks = document.querySelectorAll('.block-timeline--horizontal, .block-posts--scrollable');

class DraggableBlock {
    constructor (block) {
        this.block = block;
        this.content = this.block.querySelector('.draggable-container');
        this.list = this.block.querySelector('ol, ul');
        this.items = this.list.querySelectorAll('.draggable-item');
        this.previous = this.block.querySelector('.previous');
        this.next = this.block.querySelector('.next');
        this.clicOnBtn = false;

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
        this.handleScroll();
    }

    resize () {
        let maxTitleHeight = 0;

        this.block.style = '';

        this.itemWidth = this.items[0].offsetWidth;

        this.items.forEach((item) => {
            maxTitleHeight = Math.max(item.querySelector('.title, [itemprop="headline"]').offsetHeight, maxTitleHeight);
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
            this.clicOnBtn = true;
            this.goTo(this.index-1);
        });
        this.next.addEventListener('click', () => {
            this.clicOnBtn = true;
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

        this.block.addEventListener('pointerdown', (event) => {
            if (!this.clicOnBtn) {
                this.content.classList.add('is-grabbing');
                isPointerDown = true;
                console.log(isPointerDown)
            }
            startX = event.clientX;
        });

        this.block.addEventListener('pointermove', (event) => {
            this.isManipulated = isPointerDown;
            endX = event.clientX;
            if (this.isManipulated) {
                this.items.forEach((item) => {
                    item.style.pointerEvents = "none";
                });
            }
        });
    
        endEvents.forEach(event => {
            this.block.addEventListener(event, (event) => {
                isPointerDown = false;
                this.onManipulationEnd(startX, endX, threshold);
            });
        });
    }
    
    handleScroll() {
        this.content.addEventListener('wheel', (event) => {
            const deltaX = event.deltaX;
            const deltaY = event.deltaY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX !== 0) {
                    if (deltaX > 0) {
                        this.goTo(this.index + 1);
                    } else {
                        this.goTo(this.index - 1);
                    }
                }
            }
        });
    }

    onManipulationEnd (start, end, threshold) {
        if (start > end + threshold) {
            this.goTo(this.index+1);
        } else if (start < end - threshold) {
            this.goTo(this.index-1);
        }

        this.content.classList.remove('is-grabbing');
        this.items.forEach((item) => {
            item.style.pointerEvents = "all";
        });

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

draggableBlocks.forEach((block) => {
    new DraggableBlock(block);
});
