#! /bin/bash

search=$1
replace=$2

find . -name "*.html" -type f -exec sed -i '' "s/${search//\//\\/}/${replace//\//\\/}/g" {} +
