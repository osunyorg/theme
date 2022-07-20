# Osuny School Theme

## Installer le thème

```
git submodule add https://github.com/noesya/osuny-hugo-theme.git themes/osuny-hugo-theme
```

Dans le config.yaml
```
theme: osuny-hugo-theme
```

Puis il faut créer un package.json avec ```yarn init``` et y ajouter :

```
"dependencies": {
  "osuny-hugo-theme": "./themes/osuny-hugo-theme"
},
"scripts": {
  "watch": "hugo server",
  "build": "hugo --minify"
}
```

## Home page

Il faut un fichier _index.html à la racine du dossier content, qui sert de home page, avec la body class `page__home`.

```
content
|   _index.html
```

Il faut remettre la description sans HTML, pour le SEO, mettre le contenu HTML dans le corps du fichier, par souci de cohérence. Le breadcrumb_title permet de gérer le breadcrumb de façon unifiée.
```markdown
---
title: L’IUT Bordeaux Montaigne, le plus court chemin pour aller loin
breadcrumb_title: Accueil
image: "29f2e051-1298-48d4-9e21-5badbd606d30"
description: >
  L'Institut Universitaire de Technologie Bordeaux Montaigne, le plus court chemin pour aller loin
---
L’IUT Bordeaux Montaigne,<br><em>le plus court chemin pour aller loin</em>
```

## Branches ou feuilles ?

Il y a 2 façons de structurer les contenus : en branches (ou sections) et en feuilles (ou pages).

### Branches
Avec des fichiers _index.html:
```
content
└───programs/_index.html
│   └───bachelor-universitaire-de-technologie/_index.html
│       └───carrieres-sociales/_index.html
│           └───parcours-animation-sociale-et-socioculturelle/_index.html
```
Les branches sont pensées pour structurer des contenus, et sont donc rendues avec le template "list.html".


L'affichage des enfants dans l'ordre se fait comme cela :
```
{{ range sort .Pages ".Params.position"  }}
  <a href="{{ .Permalink }}">{{ .Title }}</a>
{{ end }}
```

### Feuilles
Avec des fichiers nommés:
```
content
└───pages
│   │   notre-institut.html
│   └───notre-institut
│       │   consignes-de-securite.html
│       │   equipe-pedagogique.html
```
Les feuilles sont des objets indépendants, rendues avec le template "single.html"

Pour afficher les enfants, il faut ajouter une propriété child_pages (le nom est arbitraire):
```markdown
---
...
child_pages:
  - "/notre-institut/presentation-de-liut/"
  - "/notre-institut/consignes-de-securite/"
...
---
```

L'affichage se fait comme cela :
```
  {{ range .Params.child_pages }}
    {{ $page := partial "utils/GetPageByUrl.html" . }}
    <div class="col">
      <a href="{{ $page.Permalink }}">{{ htmlUnescape $page.Title }}</a>
    </div>
  {{ end }}
```

### Hybride
Dans l'idée de départ de Hugo, on fait des branches quand on veut grouper des feuilles, et donc on mélange les deux.
On peut le faire, ce qui est très idiomatique, mais cela oblige à ranger différemment les objets qui ont des enfants et ceux qui n'en ont pas, ce qui rend l'algorithme d'export plus compliqué :
```
content
└───pages/
│   └───notre-institut/_index.html
│       │   consignes-de-securite.html
│       │   equipe-pedagogique.html
└───programs/_index.html
│   └───bachelor-universitaire-de-technologie/_index.html
│       └───carrieres-sociales/_index.html
│           │   parcours-animation-sociale-et-socioculturelle.html
```

### Arbitrage
Dans les 3 cas, il faut spécifier les urls dans le frontmatter des contenus.
D'après mes tests, on ne peut pas s'appuyer sur une génération de permalinks récursifs à partir des slugs.
Les sections utilisent toujours les noms de fichiers si elles n'ont pas d'url spécifiée, on ne peut pas leur attribuer de format de permalink dans la config.
Les permalinks ne fonctionnent que pour les pages.


La logique de branche est plus native pour lister les enfants, elle utilise l'objet .Pages, et on ajoute la position pour gérer l'ordre.
Elle implique que les objets sont tous rendus par le template list, les feuilles étant considérées comme des listes vides, ce qui est curieux mais pas très grave.
La logique de feuille avec child_pages utilise un partial maison (utils/GetPageByUrl), qui itère sur l'ensemble des pages.
C'est certainement sous-optimal en termes de performance.


Le choix pur feuilles paraît sans bénéfice.
Le choix pur branches est simple en termes de génération, avec un manque d'élégance.
Le choix hybride est le plus compliqué à générer et le plus élégant du point de vue d'Hugo.


En attente de décision définitive, tout branches.

## Pages

Il faut changer l'architecture vers un système de branches :
```
content
└───pages
│   └───notre-institut/_index.html
│       └───consignes-de-securite/_index.html
│       └───equipe-pedagogique/_index.html
```

Il faut aussi des slashs finaux aux URLS, c'est la pratique adoptée par Hugo (https://discourse.gohugo.io/t/hugo-support-for-urls-without-a-trailing-slash/6763)


Il serait préférable de remettre le text dans le corps des documents et pas dans le frontmatter, puisque nous n'allons plus récupérer les contenus existants sur Github.


```markdown
---
title: "Plan d’accès et contact"
url: "/notre-institut/plan-dacces-et-contact/"
position: 1
categories:
  - "a-la-une"
description: >
  Où sommes nous ? ATTENTION : nous ne sommes pas sur le site du Campus
---
Où sommes nous ?<br><br>  <strong>ATTENTION : nous ne sommes pas sur
```

Suppression d'identifier et parent qui ne sont pas nécessaires.
On garde position pour mettre les pages enfants dans le bon ordre.

## Posts

L'arborescence peut être reprise telle quelle sans problème.

Un fichier _index.html doit être ajouté à la racine pour matérialiser la liste des actualités.

Les fichiers doivent être harmonisés,
```markdown
---
title: "Une bourse ? Un logement ? Constituez dès maintenant votre dossier social étudiant (DSE)"
date: 2021-01-25 15:02:00 +0100 UTC
slug: "constituez-votre-dossier-social-etudiant"
weight: 1
authors:
  - "hbeneyrol"
categories:
  - "a-la-une"
image: "d97ed0d8-27f6-4c29-8bc3-aac021e6308a"
description: >
  N’attendez pas les résultats de vos examens ou votre affectation sur Parcoursup...
---
<img width="480" height="230" src="https://www.iut.u-bordeaux-montaigne.fr/wp-content/uploads/2021/01/Demande_DSE_2021.png"> N’attendez pas les résultats de vos examens ou votre affectation sur Parcoursup ...
```

Weight est utilisé pour épingler les articles, à 0 l'article est dans le flux normal, à 1 il est mis en avant.

## Catégories

Il faut changer l'architecture vers un système de feuilles :
```
content
└───categories/_index.html
│   └───a-la-une/_index.html
│   ...
```

Les catégories ressemblent à ça :
```
---
title: "À la une"
slug: "a-la-une"
---
Flash info publiés sur la page d'accueil
```

Quid des catégories nested? A tester.

## Personnes

Chaque personne peut avoir 4 rôles :
- enseignement (teacher)
- administration (administrator)
- écriture (author)
- recherche (researcher)


Pour bénéficier du système de taxonomie natif d'Hugo, nous devons créer 5 sections de contenus, dont 4 en taxonomies :
- persons (pas une taxo, liste les personnes avec tous leurs rôles)
- teachers (taxo)
- administrators (taxo)
- authors (taxo)
- researchers (taxo)


Les permalinks de ces objets sont définis dans le fichier config.yml
```
permalinks:
  persons:        /equipe/:slug/
  authors:        /equipe/:slug/actualites/
  administrators: /equipe/:slug/administration/
  researchers:    /equipe/:slug/publications/
  teachers:       /equipe/:slug/formations/
taxonomies:
  administrator:  administrators
  author:         authors
  researcher:     researchers
  teacher:        teachers
```


L'objet personne se définit comme cela :
```
---
title: >
  Justin Puyo
slug: "justin-puyo"
first_name: "Justin"
last_name: "Puyo"
phone: ""
email: "justin.puyo@iut.u-bordeaux-montaigne.fr"
roles:
  - author
  - administrator
---
Lorem ipsum
```

Le rendu se fait avec les layouts persons/list.html et persons/single.html.

### Auteurs

Les contenus sont organisés comme les catégories :
```
content
└───authors
│   │   _index.html
│   └───justin-puyo/_index.html
│   ...
```

Chaque auteur est défini de cette façon, attention à mettre le prénom avant le nom :
```
---
title: >
  Actualités de Justin Puyo
person: >
  Justin Puyo
slug: "justin-puyo"
---
```

Le rendu se fait avec les layouts authors/list.html et authors/term.html.

### Chercheurs, administrateurs et enseignants

Idem auteurs, avec le title différent :
- Publications de Justin Puyo
- Responsabilités de Justin Puyo
- Enseignements de Justin Puyo

## Formations

Les formations sont gérées en sections Hugo, ce qui permet de les lister en arbre.
```
content
└───programs/_index.html
│   └───bachelor-universitaire-de-technologie/_index.html
│       └───carrieres-sociales/_index.html
│           └───parcours-animation-sociale-et-socioculturelle/_index.html
```

La position est maintenue dans le frontmatter, pour trier les formations d'un même niveau.

```
---
title: "BUT Animation sociale et socioculturelle"
url: /programmes/bachelor-universitaire-de-technologie/carrieres-sociales/parcours-animation-sociale-et-socioculturelle/
continuing: false
level: bachelor
ects:
position: 1
teachers:
  - marlene-dulaurans
administrators:
  - quentin-bessiere
accessibility: >

contacts: >
   <strong>Responsable pédagogique : </strong><br>Francesca Lynn...
duration: >

evaluation: >

objectives: >
  Le parcours « Animation sociale et socioculturelle » forme des futurs professionnels ...
opportunities: >
  Le B.U.T. peut déboucher sur une insertion professionnelle ou sur une poursuite ...
other: >

pedagogy: >
  Les 3 années du programme national comportent 1800 heures de formation sur 6 semestres, ...
prerequisites: >
   La formation est ouverte aux élèves de terminale (toutes spécialités), aux titulaires ...
pricing: >

registration: >

---
```

## SEO

Attention, à l'heure actuelle on utilise l'image originale pour le SEO, il faut utiliser une image redimensionnée.

## Breadcrumb

Tout fonctionne avec le partial header/breadcrumbs.

## Menu

Attention, mettre des trailing slashs partout.
Si les liens sont externes, mettre un target blank.

## Medias

GetMedia permet de récupérer les données relatives au media dans les data.


GetImageUrl transforme une URL de média Osuny pour y ajouter des demandes de transformation (taille, format...).
Il faudrait peut-être le renommer GetOsunyImageUrl.


Le partial commons/image génère une balise picture et des src-set, équivalent à [Kamifusen](https://rubygems.org/gems/kamifusen), mais sur la base d'un media. Il faudrait peut-être le renommer imageFromOsuny.

data/media/me/media-id.md

```
---
name: Mon image.jpg
size: 2450
width: 2300
height: 1599
ratio: 1.438
url: https://demo.osuny.org/media/media-id/mon_image.jpg
---
```

content/pages/page-test/_index.html

```
---
title: Page test
image: media-id
---
```

On l'utilise avec (à revoir) :

```
{{ partial  "commons/image.html"
            (dict
              "alt"    .Title
              "image"    .Params.image
              "class"    "img-fluid"
              "mobile"   "202x202"
              "tablet"   "192x192"
              "desktop"  "196x196"
            ) }}
```

Cela génère :

```html
<picture>
    <source>
    <img>
</picture>
```

Syntaxe de transformation type Shopify (à revoir)

```
{{ partial  "GetImageUrlOsuny" 
            (dict 
              "url" $url
              "size" "500x500"
              "crop" "center"
              "scale" 2
              "format" "webp"
            ) }}
```

- `https://demo.osuny.org/media/media-id/mon_image.jpg`
- `https://demo.osuny.org/media/media-id/mon_image_500x.jpg`
- `https://demo.osuny.org/media/media-id/mon_image_500x500.jpg`
- `https://demo.osuny.org/media/media-id/mon_image_500x500_crop_center.jpg`
- `https://demo.osuny.org/media/media-id/mon_image.webp`
- `https://demo.osuny.org/media/media-id/mon_image_500x.webp`
- `https://demo.osuny.org/media/media-id/mon_image_500x500.webp`
- `https://demo.osuny.org/media/media-id/mon_image_500x500_crop_center.webp`

