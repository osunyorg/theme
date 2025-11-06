import { isMobile } from '../../utils/breakpoints';
import { focusTrap } from '../../utils/focus-trap';

window.osuny = window.osuny || {};

var CLASSES = {
    offcanvasOpened: 'has-offcanvas-opened',
    linkActive: 'active',
    isOpened: 'is-opened',
    fullWidth: 'full-width',
    offcanvas: 'offcanvas-toc'
};

window.osuny.TableOfContents = function (element) {
    this.element = element;
    this.content = this.element.querySelector('.toc-content');
    this.nav = this.element.querySelector('.toc');
    this.links = this.element.querySelectorAll('a');
    this.sections = document.querySelectorAll('main .heading[id]');
    // TODO : handle sublinks update in toc 
    this.ctaTitle = document.querySelector('.toc-cta-title span');
    this.openerButton = document.querySelector('.toc-cta button');
    this.togglers = document.querySelectorAll('.toc-cta button, .toc-container button');
    this.state = {
        opened: false,
        currentId: null,
        currentLink: 0,
        isOffcanvas: null
    };
    this.listen();
    this.state.isOffcanvas = this.isOffcanvas()
    if (this.state.isOffcanvas) {
        this.element.setAttribute('aria-hidden', true);
    }
};

window.osuny.TableOfContents.prototype.isOffcanvas = function () {
    return isMobile() || document.body.classList.contains(CLASSES.fullWidth) || document.body.classList.contains(CLASSES.offcanvas);
};

window.osuny.TableOfContents.prototype.listen = function () {
    window.addEventListener('scroll', this.update.bind(this), false);

    window.addEventListener('resize', this.resize.bind(this), false);

    this.togglers.forEach( function (toggler) {
        toggler.addEventListener('click', function () {
            this.toggle();
        }.bind(this));
    }.bind(this));

    this.links.forEach( function (links) {
        links.addEventListener('click', function () {
            this.toggle(false);
        }.bind(this));
    }.bind(this));

    window.addEventListener('click', function (event) {
        if (event.target === document.body) {
            this.toggle(false);
        }
    }.bind(this));

    window.addEventListener('keydown', function (event) {
        if (event.keyCode === 27 || event.key === 'Escape') {
            this.toggle(false);
        }
        focusTrap(event, this.element, this.state.opened);
    }.bind(this));
};

window.osuny.TableOfContents.prototype.toggle = function (open) {
    if (!this.state.isOffcanvas) {
        return;
    }
    this.state.opened = typeof open !== 'undefined' ? open : !this.state.opened;
    var classAction = this.state.opened ? 'add' : 'remove',
        transitionDuration = this.state.opened ? 0 : this.getTransitionDuration();

    // TODO: refacto timeout and css transition
    setTimeout( function () {
        this.element.setAttribute('aria-hidden', !this.state.opened);
    }.bind(this), transitionDuration * 1000);

    setTimeout( function () {
        this.element.classList[classAction](CLASSES.isOpened);
    }.bind(this), 50);

    document.documentElement.classList[classAction](CLASSES.offcanvasOpened);
};

window.osuny.TableOfContents.prototype.getTransitionDuration = function () {
    var transitionDuration = getComputedStyle(this.element).getPropertyValue('--toc-transition-duration');
    transitionDuration = parseFloat(transitionDuration.replace('s', ''))
    return transitionDuration;
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
            link.classList.add(CLASSES.linkActive);
            link.setAttribute('aria-current', 'true');
            this.updateCtaTitle(link);
            this.state.id = id;
            this.state.currentLink = link;
        } else {
            link.classList.remove(CLASSES.linkActive);
            link.removeAttribute('aria-current');
        }
    }.bind(this));
};

window.osuny.TableOfContents.prototype.updateCtaTitle = function (link) {
    if (isMobile()) {
        this.openerButton.setAttribute('aria-label', link.innerText +  osuny.i18n.toc.button_label);
        this.ctaTitle.innerText = link.innerText;
    } else {
        this.ctaTitle.innerText = this.ctaTitle.getAttribute('data-default');
    }
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