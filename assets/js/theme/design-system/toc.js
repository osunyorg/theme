import { isMobile } from '../utils/breakpoints';

const CLASSES = {
  offcanvasOpened: 'has-offcanvas-opened',
  linkActive: 'active',
  isOpened: 'is-opened',
  fullWidth: 'full-width',
  offcanvas: 'offcanvas-toc'
};

class TableOfContents {
  constructor(element) {
    this.element = element;
    this.content = this.element.querySelector('.toc-content');
    this.nav = this.element.querySelector('.toc');
    this.links = this.element.querySelectorAll('a');
    this.sections = document.querySelectorAll('section[id]');
    // TODO : handle sublinks update in toc 
    this.ctaTitle = document.querySelector('.toc-cta-title span');
    this.togglers = document.querySelectorAll('.toc-cta button, .toc-container button');
    this.state = {
      opened: false,
      currentId: null,
      currentLink: 0,
      isOffcanvas : this.isOffcanvas()
    }
    this.listen();

    if (this.state.isOffcanvas) {
      this.element.setAttribute("aria-hidden", true);
    }
  }
  isOffcanvas() {
    return isMobile() || document.body.classList.contains(CLASSES.fullWidth) || document.body.classList.contains(CLASSES.offcanvas);
  }
  listen() {
    window.addEventListener('scroll', this.update.bind(this), false);

    this.togglers.forEach(toggler => {
      toggler.addEventListener('click', () => {
        this.toggle();
      });
    })

    this.links.forEach(links => {
      links.addEventListener('click', () => {
        this.toggle(false);
      });
    })

    window.addEventListener('click', (event) => {
      if (event.target === document.body) {
        this.toggle(false);
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.keyCode === 27 || event.key === 'Escape') {
        this.toggle(false);
      }
    });
  }
  toggle(open) {
    this.state.opened = typeof open !== 'undefined' ? open : !this.state.opened;
    const classAction = this.state.opened ? 'add' : 'remove';
    const transitionDuration = this.state.opened ? 0 : this.getTransitionDuration();

    // TODO: refacto timeout and css transition
    setTimeout(() => {
      this.element.setAttribute("aria-hidden", !this.state.opened);
    }, transitionDuration * 1000);

    setTimeout(() => {
      this.element.classList[classAction](CLASSES.isOpened);
    }, 50)
    
    document.documentElement.classList[classAction](CLASSES.offcanvasOpened);
  }
  getTransitionDuration() {
    let transitionDuration = getComputedStyle(this.element).getPropertyValue('--toc-transition-duration');
    transitionDuration = parseFloat(transitionDuration.replace('s', ''))
    return transitionDuration;
  }
  update() {
    const scroll = document.documentElement.scrollTop || document.body.scrollTop;
    let id = null;
    this.sections.forEach(section => {
      if (this.getAbsoluteOffsetTop(section) <= scroll + window.innerHeight/2) {
        id = section.id;
      }
    });

    if (id && id !== this.state.currentId) {
      this.activateLink(id);
    }
    this.updateScrollspy(scroll);
  }
  getAbsoluteOffsetTop(element) {
    let top = 0;
    do {
        top += element.offsetTop  || 0;
        element = element.offsetParent;
    } while(element);
    return top
  }
  activateLink(id) {
    const currentLink = this.element.querySelector(`[href*=${ id }]`);

    this.links.forEach((link, index) => {
      if (link == currentLink) {
        link.classList.add(CLASSES.linkActive);
        this.updateCtaTitle(link);
        this.state.id = id;
        this.state.currentLink = link;
      } else {
        link.classList.remove(CLASSES.linkActive)
      }
    });
  }
  updateCtaTitle(link) {
    if (isMobile()) {
      this.ctaTitle.innerText = link.innerText;
    } else {
      this.ctaTitle.innerText = this.ctaTitle.getAttribute('data-default');
    }
  }
  updateScrollspy(scroll) {
    const container = this.state.isOffcanvas ? this.nav : this.content;
    if (this.state.currentLink && scroll > window.innerHeight) {
      let progress = (this.getAbsoluteOffsetTop(this.state.currentLink) - container.offsetHeight/2);
      progress = this.state.isOffcanvas ? progress : progress - scroll;
      container.scrollTo({
        top: progress
      })
    }
  }
}

const toc = document.querySelector('.toc-container');

if (toc) {
  new TableOfContents(toc);
}