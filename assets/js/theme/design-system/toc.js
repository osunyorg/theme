
const CLASSES = {
  // TODO : refacto classnames et modifier le nom de la class pour "is-overlay-visible"
  offcanvasOpened: 'has-offcanvas-opened',
};

class TableOfContent {
  constructor() {
    this.element = document.querySelector('.toc-container');
    this.links = this.element.querySelectorAll('a');
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
    this.links.forEach(link => {

    })
  }
}

new TableOfContent()