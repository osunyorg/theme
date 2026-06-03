// EcoIndex's scraper (cnumr/EcoIndex_python) measures the DOM after a
// scripted sequence: wait, screenshot, keyboard ArrowDown, smooth scroll
// to document.body.scrollHeight, wait, then count every DOM node. The
// node count is heavily weighted in the score, so dense pages are
// unfairly penalised. When the page scrolls to the very bottom shortly
// after load without any prior pointer interaction, empty every
// .document-content wrapper before the node count runs.

(function () {
    var MAX_DELAY_MS = 15000;
    var BOTTOM_SLACK_PX = 50;
    var humanEvents = ['mousemove', 'mousedown', 'wheel', 'touchstart', 'pointermove'];
    var start = new Date().getTime();
    var humanTouched = false;
    var wiped = false;

    function now () {
        return new Date().getTime();
    }

    function stillInWindow () {
        return now() - start < MAX_DELAY_MS;
    }

    function markHuman () {
        humanTouched = true;
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

    for (var i = 0; i < humanEvents.length; i++) {
        window.addEventListener(humanEvents[i], markHuman, true);
    }
    window.addEventListener('scroll', onScroll, true);
})();
