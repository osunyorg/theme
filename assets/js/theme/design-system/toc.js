import { isMobile } from '../utils/breakpoints';

const CLASSES = {
  offcanvasOpened: 'has-offcanvas-opened',
  linkActive: 'active',
  isOpened: 'is-opened',
  fullWidth: 'full-width'
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
      currentId: null
    }
    this.listen();

    if (this.isOffcanvas) {
      this.element.setAttribute("aria-hidden", true);
    }
  }
  isOffcanvas() {
    return isMobile() || document.body.classList.contains(CLASSES.fullWidth);
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
      if (this.getAbsoluteOffsetTop(section) <= scroll) {
        id = section.id;
      }
    });

    if (id && id !== this.state.currentId) {
      this.activateLink(id);
    }
    this.updateScrollspy(scroll);
  }
  getAbsoluteOffsetTop(element) {
    return element.getBoundingClientRect().top
  }
  activateLink(id) {
    console.log(id)
    const currentLink = this.element.querySelector(`[href*=${ id }]`);
    this.state.id = id;
    this.links.forEach(link => link.classList.remove(CLASSES.linkActive));
    if (currentLink) {
      currentLink.classList.add(CLASSES.linkActive);
      this.updateCtaTitle(currentLink);
    }
  }
  updateCtaTitle(link) {
    if (isMobile()) {
      this.ctaTitle.innerText = link.innerText;
    } else {
      this.ctaTitle.innerText = this.ctaTitle.getAttribute('data-default');
    }
  }
  updateScrollspy(scroll) {
    const progression = Math.max((scroll - window.innerHeight) / document.body.offsetHeight, 0);
    const container = this.isOffcanvas() ? this.nav : this.content;
    // TODO: ne fonctionne pas avec le  behavior-scroll: smooth
    container.scrollTop = progression * window.innerHeight/2;
  }
}

const toc = document.querySelector('.toc-container');

if (toc) {
  new TableOfContents(toc);
}