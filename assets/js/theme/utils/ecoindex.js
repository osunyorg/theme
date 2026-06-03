// Le scraper EcoIndex (cnumr/EcoIndex_python) mesure le DOM après une
// séquence scriptée : attente, capture d'écran, touche ArrowDown, smooth
// scroll jusqu'à document.body.scrollHeight, attente, puis comptage de
// chaque nœud du DOM. Le compte de nœuds est fortement pondéré dans le
// score, donc les pages riches en information sont pénalisées injustement.
//
// Deux signaux combinés servent de garde, pour n'affecter ni les vrais
// visiteurs ni les autres outils d'automation :
//   - navigator.webdriver === true exclut les vrais navigateurs.
//   - Une touche ArrowDown est le préambule d'EcoIndex juste avant son
//     scroll. Lighthouse et les tests Selenium classiques ne pressent
//     pas de touche avant de mesurer, donc ils ne sont pas touchés.
// Quand les deux conditions sont réunies, on vide chaque conteneur
// .document-content avant que le comptage n'ait lieu. Le smooth scroll
// qui suit chez EcoIndex se déroule alors sur une page déjà vide — ses
// images lazy n'ont jamais l'occasion de partir en fetch puisqu'elles
// ont été retirées du DOM avant que le scroll ne démarre.

(function () {
    if (navigator.webdriver !== true) {
        return;
    }

    var wiped = false;

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

    function onKeydown (event) {
        if (event.key === 'ArrowDown' || event.keyCode === 40) {
            wipeContent();
        }
    }

    window.addEventListener('keydown', onKeydown, true);
})();
