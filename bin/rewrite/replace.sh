#! /bin/bash

search=$1
replace=$2

find ./**/*.html -type f -exec sed -i '' "s/${search//\//\\/}/${replace//\//\\/}/g" {} +
