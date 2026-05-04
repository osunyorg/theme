import { isMobile } from '../../utils/breakpoints';
import { focusTrap } from '../../utils/focus-trap';

window.osuny = window.osuny || {};

window.osuny.TableOfContents = function (element) {
    this.element = element;
    this.content = this.element.querySelector('.toc-content');
    this.nav = this.element.querySelector('.toc');
    this.links = this.element.querySelectorAll('a');
    this.sections = this.getSections();
    this.ctaTitle = document.querySelector('.toc-cta-title span');
    this.buttonOpen = document.querySelector('.toc-cta button');
    this.buttonClose = document.querySelector('.toc-content > button');
    this.togglers = document.querySelectorAll('.toc-cta button, .toc-container button');

    this.state = {
        opened: false,
        currentId: null,
        currentLink: 0,
        isOffcanvas: this.isOffcanvas()
    };

    this.classes = {
        offcanvasOpened: 'has-offcanvas-opened',
        linkActive: 'active',
        isOpened: 'is-opened',
        fullWidth: 'full-width',
        offcanvas: 'offcanvas-toc'
    };

    this.listen();
    this.initializeAria();
};

window.osuny.TableOfContents.prototype.getSections = function () {
    var sections = [],
        id,
        section;

    this.links.forEach(function (link) {
        id = link.getAttribute('href').replace('#', '');
        section = document.getElementById(id);
        if (section) {
            sections.push(section);
        }
    });

    return sections;
};

window.osuny.TableOfContents.prototype.initializeAria = function () {
    if (this.state.isOffcanvas) {
        this.element.setAttribute('aria-hidden', true);
    }
}

window.osuny.TableOfContents.prototype.isOffcanvas = function () {
    return isMobile() || document.body.classList.contains(this.classes.fullWidth) || document.body.classList.contains(this.classes.offcanvas);
};

window.osuny.TableOfContents.prototype.listen = function () {
    window.addEventListener('scroll', this.update.bind(this), false);
    window.addEventListener('resize', this.resize.bind(this), false);

    this.buttonOpen.addEventListener('click', this.open.bind(this));
    this.buttonClose.addEventListener('click', this.close.bind(this));

    this.links.forEach( function (link) {
        link.addEventListener('click', this.close.bind(this));
    }.bind(this));

    window.addEventListener('click', function (event) {
        if (event.target === document.body) {
            this.close();
        }
    }.bind(this));

    window.addEventListener('keydown', function (event) {
        if (event.keyCode === 27 || event.key === 'Escape') {
            this.close();
        }
        focusTrap(event, this.element, this.state.opened);
    }.bind(this));
};

window.osuny.TableOfContents.prototype.open = function () {
    if (!this.state.isOffcanvas) {
        return;
    }
    this.state.opened = true;
    this.element.setAttribute('aria-hidden', false);
    document.documentElement.classList.add(this.classes.offcanvasOpened);
    setTimeout( function () {
        this.element.classList.add(this.classes.isOpened);
        this.buttonClose.focus();
    }.bind(this), 50);
};

window.osuny.TableOfContents.prototype.close = function () {
    this.state.opened = false;
    this.element.classList.remove(this.classes.isOpened);
    this.buttonOpen.focus();
    document.documentElement.classList.remove(this.classes.offcanvasOpened);
    setTimeout( function () {
        this.element.setAttribute('aria-hidden', true);
    }.bind(this), this.getTransitionDuration());
};

window.osuny.TableOfContents.prototype.getTransitionDuration = function () {
    var style = getComputedStyle(this.element),
        property = style.getPropertyValue('transition-duration');
        milliseconds = parseFloat(property.replace('s', '')) * 1000;
    return milliseconds;
};

window.osuny.TableOfContents.prototype.update = function () {
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    var id = null;
    this.sections.forEach(function (section) {
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
    var currentLink = this.element.querySelector(`[href*='${id}']`);

    this.links.forEach( function (link) {
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
    var container = this.state.isOffcanvas ? this.nav : this.content;
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

window.osuny.page.registerComponent({
    name: 'tableOfContents',
    selector: '.toc-container',
    klass: window.osuny.TableOfContents
});