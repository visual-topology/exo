
import sys
colours = ["orange", "red", "blue", "green", "brown", "purple"]

document_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>exo+skeleton demo</title>
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href='//fonts.googleapis.com/css?family=Raleway:400,300,600' rel='stylesheet' type='text/css'/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.css" type='text/css'/>
    <link rel="stylesheet" href="exo.css"/>
    <link rel="stylesheet" href="icons/exo-icons$STYLENAME$.css"/>
    <link rel="stylesheet" href="icons/exo-icons$STYLENAME$-white.css"/>
    <link rel="stylesheet" href="icons/exo-icons$STYLENAME$-orange.css"/>
    <link rel="stylesheet" href="icons/exo-icons$STYLENAME$-red.css"/>
    <link rel="stylesheet" href="icons/exo-icons$STYLENAME$-blue.css"/>
    <link rel="stylesheet" href="icons/exo-icons$STYLENAME$-green.css"/>
    <link rel="stylesheet" href="icons/exo-icons$STYLENAME$-brown.css"/>
    <link rel="stylesheet" href="icons/exo-icons$STYLENAME$-purple.css"/>
</head>
<body>
<div class="container">
    <h2>Icon Styles</h2>
        
        <div><a href="exo-icons.html">Default (filled) Icons</a></div>
        <div><a href="exo-icons-outlined.html">Outlined Icons</a></div>
        <div><a href="exo-icons-round.html">Round Icons</a></div>
        <div><a href="exo-icons-sharp.html">Sharp Icons</a></div>
        <div><a href="exo-icons-twotone.html">Twotone Icons</a></div>
        
    <h2>Icons $STYLENAME$</h2>
    
    To use icons with this style, include one or more of the following stylesheets for the required colours
    
    <table>
        <tr><th>colour</th><th>link</th></tr>
        <tr><td>black</td><td><pre style="margin:0px;"><code>&lt;link rel="stylesheet" href="icons/exo-icons$STYLENAME$.css"/&gt;</code></pre></td></tr>
        <tr><td>white</td><td><pre style="margin:0px;"><code>&lt;link rel="stylesheet" href="icons/exo-icons$STYLENAME$-white.css"/&gt;</code></pre></td></tr>"""+\
        "".join("""<tr><td>%(colour)s</td><td><pre style="margin:0px;"><code>&lt;link rel="stylesheet" href="icons/exo-icons$STYLENAME$-%(colour)s.css"/&gt;</code></pre></td></tr>""" % {"colour":colour} for colour in colours)+"""
    </table>
        
    (Hover over an icon to see the corresponding class names to add to a div or span)
    
    <table>
    <thead>
        <th>icon name</th>
        <th>default</th>"""+"".join("""<th colspan="2" style="text-align:center;">%(colour)s</th>""" % { "colour":colour } for colour in colours) + """
    </thead>
    <tbody>
    $ROWS$
    </tbody>
    </table>
</div>
</body>
</html>"""

row_template = """
<tr>
    <td>
        exo-icon-$ICON-NAME$
    </td>
    <td>
        <div class="exo-icon exo-icon-$ICON-NAME$" title="exo-icon exo-icon-$ICON-NAME$"></div>
    </td>""" + \
    "".join("""<td>
        <div class="exo-icon exo-icon-$ICON-NAME$-white exo-%(colour)s" title="exo-icon exo-icon-$ICON-NAME$-white exo-%(colour)s"></div>
    </td>
    <td>
        <div class="exo-icon exo-icon-$ICON-NAME$-%(colour)s" title="exo-icon exo-icon-$ICON-NAME$-%(colour)s"></div>
    </td>""" % { "colour":colour } for colour in colours) \
    + """
</tr>"""

css_filename = sys.argv[1]
html_filename = sys.argv[2]
stylename = sys.argv[3]

lines = open(css_filename).readlines()

import re
regexp = re.compile("\.exo-icon.([^\s]+).*")

rows = ""
for line in lines:
    match = regexp.match(line.strip())
    if match:
        icon_name = match.group(1)
        print(icon_name)
        rows += row_template.replace("$ICON-NAME$",icon_name.replace("."," "))

template = document_template.replace("$FILENAME$",css_filename).replace("$ROWS$",rows).replace("$STYLENAME$",stylename)
with open(html_filename,"w") as of:
    of.write(template)