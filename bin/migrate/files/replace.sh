#!/bin/bash

# Files to move
files="themes/osuny/bin/migrate/files/v7-to-v8.csv"

# Theme to update
theme=$1

# Vérifier la présence d'un dossier /layouts
if [[ -d "./layouts" || -d "./themes/$theme/layouts" ]]; then
    echo "Présence d'un dossier layouts"
else
    echo "Pas de dossiers layouts ni de thème à migrer"
    exit 0
fi

# Ignorer la première ligne (les en-têtes) et gérer les lignes vides
sed 1d "$files" | while IFS=',' read -r old new; do
    # Vérifier si la ligne est vide (après suppression des espaces)
    if [[ -z "$old" && -z "$new" ]]; then
        continue  # Ignorer la ligne vide
    fi

    # Enlever le début du chemin dans le fichier
    old_path=$(echo "$old" | sed 's|themes/osuny/layouts/partials/||g')
    new_path=$(echo "$new" | sed 's|themes/osuny/layouts/partials/||g')

    old_path_for_mv=$(echo "$old" | sed 's|themes/osuny/layouts/||g')
    new_path_for_mv=$(echo "$new" | sed 's|themes/osuny/layouts/||g')

    # Traitement des données (affichage par exemple)
    echo "$old_path to $new_path"
    echo "$old_path_for_mv to $new_path_for_mv"

    find_in="./layouts/*"
    replace_in="layouts"
    if [ "$theme" != "" ]; then
        find_in="./themes/$theme/*"
        replace_in="themes/$theme/layouts"
    fi

    find . -path "$find_in" -type f -name "*.html" -exec sed -i '' "s/${old_path//\//\\/}/${new_path//\//\\/}/g" {} +

    # S'il existe dans les overrides, déplacer le fichier vers le nouveau chemin
    if [ -f "$replace_in/$old_path_for_mv" ]; then
        mkdir -p "$(dirname "$replace_in/$new_path_for_mv")"
        mv "$replace_in/$old_path_for_mv" "$replace_in/$new_path_for_mv"
    fi
done