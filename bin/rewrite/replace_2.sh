#!/bin/bash

# Fichier CSV
data="./data.csv"

# Ignorer la première ligne (les en-têtes) et gérer les lignes vides
sed 1d "$data" | while IFS=',' read -r old new; do
    # Vérifier si la ligne est vide (après suppression des espaces)
    if [[ -z "$old" && -z "$new" ]]; then
        continue  # Ignorer la ligne vide
    fi

    # Enlever le début du chemin dans le fichier
    old_path=$(echo "$old" | sed 's|themes/osuny/layouts/partials/||g')
    new_path=$(echo "$new" | sed 's|themes/osuny/layouts/partials/||g')

    # Traitement des données (affichage par exemple)
    echo "$old_path to $new_path"

    # TODO : Ne chercher que dans les dossiers "layouts"
    find . \( -path "*/layouts/*" -o -path "*/themes/*" \) -type f -name "*.html" -exec sed -i '' "s/${old_path//\//\\/}/${new_path//\//\\/}/g" {} +

done