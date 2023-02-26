import os
import base64
import re

current_version = "0.0.2"

colours1 = ["orange", "red", "blue", "green", "brown", "purple", "gray", "pink", "yellow"]
colours2 = ["black", "dark-orange", "dark-red", "dark-blue",
            "dark-green", "dark-brown", "dark-purple", "dark-gray", "dark-pink", "dark-yellow"]
colours3 = ["white", "light-orange", "light-red",
            "light-blue", "light-green", "light-brown", "light-purple", "light-gray", "light-pink", "light-yellow"]


class IconOutput:
    FILTER_TEMPLATE = \
"""
.exo-icon.exo-%(colour)s {
    filter: url('data:image/svg+xml,\
    <svg xmlns="http://www.w3.org/2000/svg">\
      <filter id="%(colour)s"><feColorMatrix type="matrix" values="0 0 0 0 %(r)f  0 0 0 0 %(g)f  0 0 0 0 %(b)f  0 0 0 1 0" /></filter>\
    </svg>#%(colour)s');
}"""

    CSS_TEMPLATE = \
"""
.%s {
    /* material-icon %s */
    background-image: url('data:image/svg+xml;base64,%s');
}

"""

    def __init__(self, input_css_name, output_css_name):
        self.output_css_path = os.path.join(repo_dir,output_css_name)
        self.input_css_path = os.path.join(repo_dir,input_css_name)
        self.colors = {
            "orange": "#FFA500",
            "red": "#FF0000",
            "blue": "#0000FF",
            "green": "#33CC33",
            "purple": "#990099",
            "brown": "#993300",
            "gray": "#404040",
            "pink": "#FF00FF",
            "yellow": "#E0E000"
        }

    def read_colors(self):
        lines = open(self.input_css_path).readlines()

        regexp_color = re.compile("\s*--exo-([a-z-]*):\s*(#......)")

        for line in lines:
            color_match = regexp_color.match(line.strip())
            if color_match:
                color_name = color_match.group(1)
                color = color_match.group(2)
                self.colors[color_name] = color

    def __enter__(self):
        self.of = open(self.output_css_path,"w")
        self.read_colors()
        return self

    def add_icon(self, input_name, name, svg_path):
        with open(svg_path,"r+b") as f:
            content = base64.b64encode(f.read()).decode('utf-8')
            self.of.write(IconOutput.CSS_TEMPLATE % (name, input_name, content))

    def __exit__(self, a, b, c):
        for (cname,code) in self.colors.items():
            red = int(code[1:3],16)/255
            green = int(code[3:5],16)/255
            blue = int(code[5:7],16)/255
            self.of.write(IconOutput.FILTER_TEMPLATE%{"colour":cname,"r":red,"g":green,"b":blue})
        self.of.close()

def remove_license_comments(contents):
    lines = contents.split("\n")
    lines = [line for line in lines if not line.startswith("/* MIT License")]
    return "\n".join(lines)

repo_dir = os.path.join(os.path.split(__file__)[0],"..")

class Output:

    def __init__(self, output_filename):
        self.output_path = os.path.join(repo_dir,output_filename)
        self.of = None
        self.first_entry = True

    def __enter__(self):
        self.of = open(self.output_path,"w")
        return self

    def add(self, input_path):
        fq_input_path = os.path.join(repo_dir, input_path)
        with open(fq_input_path, "r") as f:
            r = f.read()
            if not self.first_entry:
                r = remove_license_comments(r)
            self.of.write(f"/* {input_path} */\n\n")
            self.of.write(r)
            self.of.write("\n\n")
        self.first_entry = False

    def __exit__(self, a,b,c):
        self.of.close()
        self.of = None

print("Building: exo.js")

with Output("versions/latest/exo.js") as of:
    of.add("js/exo-common.js")
    of.add("js/controls/exo-button.js")
    of.add("js/controls/exo-checkbox.js")
    of.add("js/controls/exo-date.js")
    of.add("js/controls/exo-file.js")
    of.add("js/controls/exo-number.js")
    of.add("js/controls/exo-radio.js")
    of.add("js/controls/exo-range.js")
    of.add("js/controls/exo-select.js")
    of.add("js/controls/exo-text.js")
    of.add("js/controls/exo-textarea.js")
    of.add("js/controls/exo-toggle.js")
    of.add("js/controls/exo-download.js")

print("Building: exo.css")

with Output("versions/latest/exo.css") as of:
    of.add("css/header.css")
    of.add("css/typography.css")
    of.add("css/table.css")
    of.add("css/colors.css")
    of.add("css/tooltips.css")
    of.add("css/layouts.css")
    of.add("css/cards.css")
    of.add("css/input.css")
    of.add("css/checkbox.css")
    of.add("css/radio.css")
    of.add("css/toggle.css")
    of.add("css/file.css")
    of.add("css/progress.css")
    of.add("css/summary.css")
    of.add("css/modal.css")
    of.add("css/conditional.css")
    of.add("css/tree.css")
    of.add("css/carousel.css")
    of.add("css/button.css")
    of.add("css/tabs.css")
    of.add("css/menu.css")
    of.add("css/icons.css")

print("Building: exo-icons.css")

with IconOutput("versions/latest/exo.css","versions/latest/exo-icons.css") as of:
    svg_path = os.path.join(repo_dir,"svg","material_icons")
    for fname in os.listdir(svg_path):
        if fname.endswith(".svg"):
            icon_name = os.path.splitext(fname)[0]
            output_name = "exo-icon-"+icon_name
            of.add_icon("material_icons/"+icon_name, output_name, os.path.join(svg_path,fname))

class IconHTMLOutput:

    document_template = \
"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>exo demo</title>
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href='//fonts.googleapis.com/css?family=Raleway:400,300,600' rel='stylesheet' type='text/css'/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.css" type='text/css'/>
    <link rel="stylesheet" href="exo.css"/>
    <link rel="stylesheet" href="exo-icons.css"/>
</head>
<body>
<div class="exo-container">
    <h2>Exo Icons</h2>

    (Hover over an icon to see the corresponding class names to add to a div or other element)

    $TABLE1$
    $TABLE2$
    $TABLE3$
</div>
</body>
</html>"""

    table_template1 = \
"""
<table>
    <thead>
        <th>icon name</th>""" + "".join(
    """<th style="text-align:center;">%(colour)s</th>""" % {"colour": colour} for colour in colours1) + """
    </thead>
    <tbody>
    $ROWS$
    </tbody>
    </table>
"""

    table_template2 = \
"""
<table>
    <thead>
        <th>icon name</th>""" + "".join(
    """<th style="text-align:center;">%(colour)s</th>""" % {"colour": colour} for colour in colours2) + """
    </thead>
    <tbody>
    $ROWS$
    </tbody>
    </table>
"""

    table_template3 = \
"""
<table>
    <thead>
        <th>icon name</th>""" + "".join(
    """<th style="text-align:center;">%(colour)s</th>""" % {"colour": colour} for colour in colours3) + """
    </thead>
    <tbody>
    $ROWS$
    </tbody>
    </table>
"""

    row_template1 = \
"""
<tr>
    <td>
        exo-icon-$ICON-NAME$
    </td>""" + \
                "".join("""
    <td>
        <div class="exo-icon exo-icon-$ICON-NAME$ exo-%(colour)s" title="exo-icon exo-icon-$ICON-NAME$ exo-%(colour)s"></div>
    </td>""" % {"colour": colour} for colour in colours1) \
                + """
</tr>"""

    row_template2 = \
"""
<tr>
    <td>
        exo-icon-$ICON-NAME$
    </td>""" + \
                "".join("""
    <td>
        <div class="exo-icon exo-icon-$ICON-NAME$ exo-%(colour)s" title="exo-icon exo-icon-$ICON-NAME$ exo-%(colour)s"></div>
    </td>""" % {"colour": colour} for colour in colours2) \
                + """
</tr>"""

    row_template3 = \
"""
<tr>
    <td>
        exo-icon-$ICON-NAME$
    </td>""" + \
                "".join("""
    <td>
        <div class="exo-icon-background exo-black-bg">
            <div class="exo-icon exo-icon-$ICON-NAME$ exo-%(colour)s" title="exo-icon exo-icon-$ICON-NAME$ exo-%(colour)s"></div>
        </div>
    </td>""" % {"colour": colour} for colour in colours3) \
                + """
</tr>"""

    def __init__(self,css_input_name,html_output_name):
        self.css_input_name = css_input_name
        self.css_input_path = os.path.join(repo_dir,css_input_name)
        self.html_output_path = os.path.join(repo_dir,html_output_name)

    def process(self):
        lines = open(self.css_input_path).readlines()

        import re

        regexp_icon = re.compile("\.exo-icon-([^\s]+).*")

        rows1 = ""
        rows2 = ""
        rows3 = ""
        for line in lines:
            match = regexp_icon.match(line.strip())
            if match:
                icon_name = match.group(1)
                rows1 += IconHTMLOutput.row_template1.replace("$ICON-NAME$", icon_name.replace(".", " "))
                rows2 += IconHTMLOutput.row_template2.replace("$ICON-NAME$", icon_name.replace(".", " "))
                rows3 += IconHTMLOutput.row_template3.replace("$ICON-NAME$", icon_name.replace(".", " "))

        table1 = IconHTMLOutput.table_template1.replace("$ROWS$", rows1)
        table2 = IconHTMLOutput.table_template2.replace("$ROWS$", rows2)
        table3 = IconHTMLOutput.table_template3.replace("$ROWS$", rows3)

        template = IconHTMLOutput.document_template.replace("$FILENAME$", self.css_input_name) \
            .replace("$TABLE1$", table1).replace("$TABLE2$", table2).replace("$TABLE3$", table3)
        with open(self.html_output_path, "w") as of:
            of.write(template)

print("Building: exo-icons.html")

icon_html = IconHTMLOutput("versions/latest/exo-icons.css","versions/latest/exo-icons.html")
icon_html.process()
