/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

export { ExoUtils };

class ExoUtils {

    static addClasses(element, classnames) {
        classnames.forEach(classname => ExoUtils.addClass(element, classname));
    }

    static addClass(element, classname) {
        var classes = (element.getAttribute("class") || "").split(" ");
        if (classes.findIndex(name => name == classname) == -1) {
            classes.push(classname);
            var new_classes = classes.join(" ")
            element.setAttribute("class", new_classes);
        }
    }

    static removeClass(element, classname) {
        var classes = (element.getAttribute("class") || "").split(" ");
        if (classes.findIndex(classname) != -1) {
            classes.filter(name => name != classname);
            element.setAttribute("class", classes.join(" "));
        }
    }

    static addStyle(element, name, value) {
        var style = element.getAttribute("style") || "";
        style = style + name + ": " + value + ";";
        element.setAttribute("style", style);
    }

    static setAttributes(element,attr_value_pairs) {
        attr_value_pairs.forEach(pair => { element.setAttribute(pair[0],pair[1])});
    }

    static moveChildNodes(from_element,to_element) {
        var to_move = [];
        for(var idx=0; idx<from_element.childNodes.length; idx++) {
            var node = from_element.childNodes[idx];
            to_move.push(node);
        }
        for(var idx=0; idx<to_move.length; idx++) {
            var node = to_move[idx];
            console.log("moved:"+String(node));
            if (node != to_element) {
                from_element.removeChild(node);
                to_element.appendChild(node);
            }
        }
    }

    static replaceNode(old_node,new_node) {
        var parent = old_node.parentNode;
        if (!parent) {
            alert("problem here");
        }
        parent.replaceChild(new_node,old_node);
    }
}