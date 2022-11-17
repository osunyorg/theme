import { isMobile } from '../utils/breakpoints';

const CLASSES = {
  offcanvasOpened: 'has-offcanvas-opened',
  linkActive: 'active',
  isOpened: 'is-opened',
  fullWidth: 'full-width'
};

class TableOfContent {
  constructor() {
    this.element = document.querySelector('.toc-container');
    this.content = this.element.querySelector('.toc-content');
    this.nav = this.element.querySelector('.toc');
    this.links = this.element.querySelectorAll('a');
    this.sections = document.querySelectorAll('section');
    this.ctaTitle = document.querySelector('.toc-cta-title');
    this.togglers = document.querySelectorAll('.toc-cta, .toc-container button');
    this.state = {
      opened: false,
      currentId: null
    }
    this.listen();
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

    window.addEventListener('click', (event) => {
      if (event.target === document.body) {
          this.toggle(false);
      }
    });
  }
  toggle(open) {
    this.state.opened = typeof open !== 'undefined' ? open : !this.state.opened;

    const classAction = this.state.opened ? 'add' : 'remove';
    this.element.classList[classAction](CLASSES.isOpened);
    document.documentElement.classList[classAction](CLASSES.offcanvasOpened);
  }
  update(event) {
    const scroll = document.documentElement.scrollTop || document.body.scrollTop;
    console.log(event)
    let id = null;
    this.sections.forEach(section => {
      if (section.offsetTop <= scroll) {
        id = section.id;
      }
    });

    if (id && id !== this.state.currentId) {
      this.activateLink(id);
    }
    this.updateScrollspy(scroll);
  }
  activateLink(id) {
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
    // container.scrollTo({
    //   top: progression * window.innerHeight/2,
    //   behavior: 'smooth'
    // });
  }
}

new TableOfContent()