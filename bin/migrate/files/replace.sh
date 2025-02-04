#!/bin/bash

# Files to move
files="themes/osuny/bin/migrate/files/file-to-move.csv"

# Theme to update
theme=$1

# Ignorer la première ligne (les en-têtes) et gérer les lignes vides
sed 1d "$files" | while IFS=',' read -r old new; do
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
    find . \( -path "*/layouts/*" -o -path "*/themes/*" \) -type f -name "*.html" -exec sed -i '' "s/${old_path//\//\\/}\"/${new_path//\//\\/}\"/g" {} +

    # S'il existe dans les overrides, déplacer le fichier vers le nouveau chemin
    if [ -f "layouts/partials/$old_path" ]; then
        mkdir -p "$(dirname "layouts/partials/$new_path")"
        mv "layouts/partials/$old_path" "layouts/partials/$new_path"
    fi

    # S'il existe dans le thème custom, déplacer le fichier vers le nouveau chemin
    if [ "$theme" != "" ];then
        echo "$theme"
        if [ -f "themes/$theme/layouts/partials/$old_path" ]; then
            mkdir -p "$(dirname "themes/$theme/layouts/partials/$new_path")"
            mv "themes/$theme/layouts/partials/$old_path" "themes/$theme/layouts/partials/$new_path"
        fi
    fi
done