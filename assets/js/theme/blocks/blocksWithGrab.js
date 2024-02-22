const blocks = document.querySelectorAll('.block-timeline--horizontal, .block-posts--scrollable');

class BlockWithGrab {
    constructor (block) {
        this.block = block;
        this.content = this.block.querySelector('.grab-container');
        this.list = this.block.querySelector('ol, ul');
        this.items = this.list.querySelectorAll('.grab-item');
        this.previous = this.block.querySelector('.previous');
        this.next = this.block.querySelector('.next');

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
            this.goTo(this.index-1);
        });
        this.next.addEventListener('click', () => {
            this.goTo(this.index+1);
        });
    }

    handlePointers () {
        let startX,
            endX,
            threshold = 30,
            isPointerDown = false,
            hasMoved = false;

        this.content.style.touchAction = 'pan-y';

        const handlePointerMove = (event) => {
            this.isGrabbing = true;
            this.isManipulated = isPointerDown;
            endX = event.clientX;
            hasMoved = true;
    
            if (isPointerDown && hasMoved) {
                event.preventDefault();
            }
        };
        this.content.addEventListener('pointerdown', (event) => {
            startX = event.clientX;
            isPointerDown = true;
            hasMoved = false;
    
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
        });
    
        const handlePointerUp = (event) => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            
            if (!hasMoved && !this.isGrabbing) {
                const pointedElement = document.elementFromPoint(event.clientX, event.clientY);
                if (pointedElement && Math.abs(startX - event.clientX) > threshold) {
                    pointedElement.click();
                }
            }
        
            this.onManipulationEnd(startX, endX, threshold);
            this.isGrabbing = false;
        };
        
    

        // this.content.addEventListener('pointerdown', (event) => {
        //     this.content.classList.add('is-grabbing');
        //     startX = event.clientX;
        //     isPointerDown = true;
        //     hasMoved = false;
        // });

        // this.content.addEventListener('pointermove', (event) => {
        //     this.isManipulated = isPointerDown;
        //     endX = event.clientX;
        //     hasMoved = true;

        //     if (isPointerDown) {
        //         event.preventDefault();
        //     }
        // });


        // endEvents.forEach(event => {
        //     this.content.addEventListener(event, (event) => {
        //         this.isGrabbing = true;
        //         this.isManipulated = isPointerDown;

        //         if (!hasMoved) {
        //             const cursorElement = document.elementFromPoint(event.clientX, event.clientY);
    
        //             if (cursorElement) {
        //                 cursorElement.click();
        //             }
        //         }
        //         this.onManipulationEnd(startX, endX, threshold);
        //     });
        // });
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

blocks.forEach((block) => {
    new BlockWithGrab(block);
});
