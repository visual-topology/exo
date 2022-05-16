String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
}

var line_limit = 40;

function indentLine(indent) {
    var line = "\n";
    for(var i=0; i<indent*4; i++) {
        line += " ";
    }
    return line;
}

function renderChildren(parent) {
    var lines = "";
    for(var i=0; i<parent.childNodes.length; i++) {
        var child = parent.childNodes[i];
        if (child.nodeType == Node.ELEMENT_NODE) {
            lines += dumpElement(child,0);
        }
        if (child.nodeType == Node.TEXT_NODE) {
            lines += dumpTextNode(child,0);
        }
    }
    return lines;
}

function dumpElement(element,indent) {
    var lines = "";
    var line = indentLine(indent);
    var line_length = line.length;

    line += "&lt;";
    line += '<span class="tag">'+element.tagName.toLowerCase()+'</span>';
    line_length += element.tagName.toLowerCase().length + 1;
    var attrs = element.attributes;
    for(var i = 0; i < attrs.length; i++) {
        if (line_length > line_limit) {
            lines += line;
            line = indentLine(indent+1);
            line_length = line.length
        }
        line += ' ' + '<span class="attr-name">' + attrs[i].name + '</span>';
        line += "=" + '<span class="attr-value">' + '"' + attrs[i].value + '"' + '</span>';
        line_length += attrs[i].name.length + attrs[i].value.length + 4;
    }
    var children = element.childNodes;
    if (children.length==0 && element.tagName.toLowerCase() != "div") {
        line += "/&gt;";
        lines += line;
    } else {
        line += "&gt;";
        lines += line;
        for(var i=0; i< children.length; i++) {
            var node = children[i];
            if (node.nodeType == Node.ELEMENT_NODE) {
                lines += dumpElement(node,indent+1);
            }
            if (node.nodeType == Node.TEXT_NODE) {
                lines += dumpTextNode(node,indent+1);
            }
        }
        line = indentLine(indent);
        line += "&lt;/" + '<span class="tag">' + element.tagName.toLowerCase() + '</span>' + "&gt;";
        lines += line;
    }
    return lines;
}

function dumpTextNode(node,indent) {
    var lines = "";
    var line = "";
    var text = node.textContent.replace(/(\r\n|\n|\r)/gm, "").trim();
    if (text) {
        var words = text.split(" ");
        line = indentLine(indent+1);
        var added = false;
        for(var idx=0; idx<words.length; idx++) {
            var word = words[idx].trim();
            if (word) {
                if (added && (line.length + word.length > line_limit)) {
                    lines += line;
                    line = indentLine(indent + 1);
                    added = false;
                }
                line += word + " ";
                added = true;
            }
        }
        if (added) {
            lines += line;
        }
    }
    return lines;
}

function boot(override_line_limit) {
    if (override_line_limit) {
        line_limit = override_line_limit;
    }
    var i = 0;
    while(true) {
        var model = document.getElementById("model"+i);
        var view = document.getElementById("view"+i);
        if (!model || !view) {
            break;
        }
        dumped = renderChildren(model,0);
        view.innerHTML = dumped;
        i += 1;
    }
}