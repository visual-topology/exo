#!/bin/bash

cd `dirname $0`

export PYTHONPATH=`pwd`/../../fontastic

if [ -d "../icons" ];
then
  rm -rf ../icons
fi
mkdir -p ../icons

python3 -m materialise --icon-names-file=icon_names.txt \
  --icon-styles "filled=" "outlined=outlined" "twotone=twotone" "round=round" "sharp=sharp" \
  --icon-colours "" "white" "#FFA500=orange" "#FF0000=red" "#33C3F0=blue" "#33CC33=green" "#990099=purple" "#993300=brown" \
  --css-prefix exo-icon --css-output-path "../icons/exo-icons%(style)s%(colour)s.css" --svg-output-folder "../svg"

python build_icons_html.py ../icons/exo-icons.css ../exo-icons.html ""
python build_icons_html.py ../icons/exo-icons-outlined.css ../exo-icons-outlined.html "-outlined"
python build_icons_html.py ../icons/exo-icons-twotone.css ../exo-icons-twotone.html "-twotone"
python build_icons_html.py ../icons/exo-icons-round.css ../exo-icons-round.html "-round"
python build_icons_html.py ../icons/exo-icons-sharp.css ../exo-icons-sharp.html "-sharp"