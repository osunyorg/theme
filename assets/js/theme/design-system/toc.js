
const CLASSES = {
  // TODO : refacto classnames et modifier le nom de la class pour "is-overlay-visible"
  offcanvasOpened: 'has-offcanvas-opened',
};

class TableOfContent {
  constructor() {
    this.element = document.querySelector('.toc-container');
    this.content = this.element.querySelector('.toc-content');
    this.links = this.element.querySelectorAll('a');
    this.sections = document.querySelectorAll('section');
    this.togglers = document.querySelectorAll('.toc-cta, .toc-container button');
    this.state = {
      opened: false
    }
    this.listen();
  }
  listen() {
    window.addEventListener('scroll', this.update.bind(this));

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
    this.element.classList[classAction]('is-opened');
    document.documentElement.classList[classAction](CLASSES.offcanvasOpened);
  }
  update() {
    // WIP
    const scroll = document.documentElement.scrollTop || document.body.scrollTop;

    this.sections.forEach(section => {
      if (section.offsetTop <= scroll - window.innerHeight / 2) {
        this.activateLink(section.id);
      }
    });

    this.updateSidebarScroll(scroll);
  }
  activateLink(id) {
    const currentLink = this.element.querySelector(`[href*=${ id }]`);
    this.links.forEach(link => link.classList.remove('active'));
    if (currentLink) {
      currentLink.classList.add('active');
      // this.nav.scrollTo(0, currentLink.offsetTop - window.innerHeight/2);
    }
  }
  updateSidebarScroll(scroll) {
    const progression = Math.max((scroll - window.innerHeight) / document.body.offsetHeight, 0);
    this.content.scrollTo(0, progression * window.innerHeight/2)
  }
}

new TableOfContent()