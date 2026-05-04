import { isMobile } from '../../utils/breakpoints';
import { focusTrap } from '../../utils/focus-trap';

window.osuny = window.osuny || {};

window.osuny.TableOfContents = function (element) {
    this.elements = {
        root: element,
        content: element.querySelector('.toc-content'),
        nav: element.querySelector('.toc'),
        links: element.querySelectorAll('a'),
        sections: null,
        buttonOpen: document.querySelector('.toc-cta button'),
        buttonClose: document.querySelector('.toc-content > button')
    }

    this.state = {
        opened: false,
        currentId: null,
        currentLink: 0,
        isOffcanvas: null
    };

    this.classes = {
        offcanvasOpened: 'has-offcanvas-opened',
        linkActive: 'active',
        isOpened: 'is-opened',
        fullWidth: 'full-width',
        offcanvas: 'offcanvas-toc'
    };

    this.initializeSections();
    this.initializeAria();
    this.listen();
};

// Initialisation
window.osuny.TableOfContents.prototype.initializeSections = function () {
    var id,
        section,
        sections = this.elements.sections = [];
    this.elements.links.forEach( function (link) {
        id = link.getAttribute('href').replace('#', '');
        section = document.getElementById(id);
        if (section) {
            sections.push(section);
        }
    });
};

window.osuny.TableOfContents.prototype.initializeAria = function () {
    this.state.isOffcanvas = this.isOffcanvas()
    if (this.state.isOffcanvas) {
        this.elements.root.setAttribute('aria-hidden', true);
    }
}

window.osuny.TableOfContents.prototype.isOffcanvas = function () {
    return isMobile() || document.body.classList.contains(this.classes.fullWidth) || document.body.classList.contains(this.classes.offcanvas);
};

window.osuny.TableOfContents.prototype.listen = function () {
    window.addEventListener('scroll', this.update.bind(this));
    window.addEventListener('resize', this.resize.bind(this));
    window.addEventListener('click', this.clickOnBackground.bind(this));
    window.addEventListener('keydown', this.pressEscape.bind(this));
    window.addEventListener('keydown', this.checkFocusTrap.bind(this));

    this.elements.buttonOpen.addEventListener('click', this.open.bind(this));
    this.elements.buttonClose.addEventListener('click', this.close.bind(this));

    this.elements.links.forEach( function (link) {
        link.addEventListener('click', this.close.bind(this));
    }.bind(this));
};

// Méthodes

window.osuny.TableOfContents.prototype.open = function () {
    if (!this.state.isOffcanvas) {
        return;
    }
    this.state.opened = true;
    this.elements.root.setAttribute('aria-hidden', false);
    document.documentElement.classList.add(this.classes.offcanvasOpened);
    setTimeout( function () {
        this.elements.root.classList.add(this.classes.isOpened);
        this.elements.buttonClose.focus();
    }.bind(this), 50);
};

window.osuny.TableOfContents.prototype.close = function () {
    this.state.opened = false;
    this.elements.root.classList.remove(this.classes.isOpened);
    this.elements.buttonOpen.focus();
    document.documentElement.classList.remove(this.classes.offcanvasOpened);
    setTimeout( function () {
        this.elements.root.setAttribute('aria-hidden', true);
    }.bind(this), this.getTransitionDuration());
};

window.osuny.TableOfContents.prototype.getTransitionDuration = function () {
    var style = getComputedStyle(this.elements.root),
        property = style.getPropertyValue('transition-duration');
        milliseconds = parseFloat(property.replace('s', '')) * 1000;
    return milliseconds;
};

window.osuny.TableOfContents.prototype.update = function () {
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    var id = null;
    this.elements.sections.forEach(function (section) {
        if (this.getAbsoluteOffsetTop(section) <= scroll + window.innerHeight / 2) {
            id = section.id;
        }
    }.bind(this));

    if (id && id !== this.state.currentId) {
        this.activateLink(id);
    }
    this.updateScrollspy(scroll);
};

window.osuny.TableOfContents.prototype.getAbsoluteOffsetTop = function (element) {
    var top = 0;
    do {
        top += element.offsetTop || 0;
        element = element.offsetParent;
    } while (element);
    return top;
};

window.osuny.TableOfContents.prototype.activateLink = function (id) {
    var currentLink = this.elements.root.querySelector(`[href*='${id}']`);

    this.elements.links.forEach( function (link) {
        if (link === currentLink) {
            link.classList.add(this.classes.linkActive);
            link.setAttribute('aria-current', 'true');
            this.state.currentId = id;
            this.state.currentLink = link;
        } else {
            link.classList.remove(this.classes.linkActive);
            link.removeAttribute('aria-current');
        }
    }.bind(this));
};


window.osuny.TableOfContents.prototype.updateScrollspy = function (scroll) {
    var container = this.state.isOffcanvas ? this.elements.nav : this.elements.content;
    if (this.state.currentLink && scroll > window.innerHeight) {
        var progress = this.getAbsoluteOffsetTop(this.state.currentLink) - container.offsetHeight / 2;
        progress = this.state.isOffcanvas ? progress : progress - scroll;
        container.scrollTo({
            top: progress
        });
    }
};

window.osuny.TableOfContents.prototype.resize = function () {
    this.state.isOffcanvas = this.isOffcanvas();
};

window.osuny.TableOfContents.prototype.clickOnBackground = function (event) {
    if (event.target === document.body) {
        this.close();
    }
};

window.osuny.TableOfContents.prototype.pressEscape = function (event) {
    if (event.keyCode === 27 || event.key === 'Escape') {
        this.close();
    }
};

window.osuny.TableOfContents.prototype.checkFocusTrap = function (event) {
    if (this.state.opened) {
        focusTrap(event, this.elements.root, true);
    }
};

window.osuny.page.registerComponent({
    name: 'tableOfContents',
    selector: '.toc-container',
    klass: window.osuny.TableOfContents
});