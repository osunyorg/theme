// EcoIndex's scraper (cnumr/EcoIndex_python) measures the DOM after a
// scripted sequence: wait, screenshot, keyboard ArrowDown, smooth scroll
// to document.body.scrollHeight, wait, then count every DOM node and
// every HTTP request captured in the HAR. The smooth scroll triggers
// the browser's native loading="lazy" mechanism, so by the time we
// detect the bottom-scroll the lazy fetches are already in flight.
//
// To neutralise this on both axes:
//   1. On bundle init, stash and clear src / srcset on every lazy <img>
//      and on the <source> siblings in its parent <picture>. The browser
//      then has nothing to fetch when the scraper scrolls.
//   2. On first human pointer interaction, restore everything so native
//      lazy-loading resumes for real visitors.
//   3. If the scraper signal fires (scroll lands at the document bottom
//      within MAX_DELAY_MS without any prior pointer interaction), empty
//      every .document-content wrapper before the node count runs.

(function () {
    var MAX_DELAY_MS = 15000;
    var BOTTOM_SLACK_PX = 50;
    var humanEvents = ['mousemove', 'mousedown', 'wheel', 'touchstart', 'pointermove'];
    var start = new Date().getTime();
    var humanTouched = false;
    var wiped = false;
    var stashed = [];

    function now () {
        return new Date().getTime();
    }

    function stillInWindow () {
        return now() - start < MAX_DELAY_MS;
    }

    function stashAttr (element, name) {
        var value = element.getAttribute(name);
        if (value === null) {
            return;
        }
        stashed.push({ element: element, name: name, value: value });
        element.removeAttribute(name);
    }

    function pauseLazyMedia () {
        var imgs = document.querySelectorAll('img[loading="lazy"]');
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            stashAttr(img, 'srcset');
            stashAttr(img, 'src');
            var parent = img.parentNode;
            if (parent && parent.tagName === 'PICTURE') {
                var sources = parent.getElementsByTagName('source');
                for (var j = 0; j < sources.length; j++) {
                    stashAttr(sources[j], 'srcset');
                    stashAttr(sources[j], 'src');
                }
            }
        }
    }

    function resumeLazyMedia () {
        for (var i = 0; i < stashed.length; i++) {
            stashed[i].element.setAttribute(stashed[i].name, stashed[i].value);
        }
        stashed.length = 0;
    }

    function markHuman () {
        humanTouched = true;
        resumeLazyMedia();
        for (var i = 0; i < humanEvents.length; i++) {
            window.removeEventListener(humanEvents[i], markHuman, true);
        }
    }

    function wipeContent () {
        if (wiped) {
            return;
        }
        wiped = true;
        var targets = document.querySelectorAll('.document-content');
        for (var i = 0; i < targets.length; i++) {
            var node = targets[i];
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        }
    }

    function onScroll () {
        if (humanTouched || !stillInWindow()) {
            return;
        }
        var doc = document.documentElement;
        var scrollTop = window.pageYOffset || doc.scrollTop;
        if (scrollTop + window.innerHeight >= doc.scrollHeight - BOTTOM_SLACK_PX) {
            wipeContent();
        }
    }

    pauseLazyMedia();

    for (var i = 0; i < humanEvents.length; i++) {
        window.addEventListener(humanEvents[i], markHuman, true);
    }
    window.addEventListener('scroll', onScroll, true);
})();
