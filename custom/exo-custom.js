/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

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

    static getClasses(element) {
        return (element.getAttribute("class") || "").split(" ").filter(name => name != "");
    }

    static removeClass(element, classname) {
        var classes = ExoUtils.getClasses(element);
        classes = classes.filter(name => name != classname);
        element.setAttribute("class", classes.join(" "));
    }

    static removeClasses(element, pattern) {
        var classes = ExoUtils.getClasses(element);
        classes.forEach(cls => {
            let resolved = cls.match(pattern);
            if (resolved != null) {
                this.removeClass(element, cls);
            }});
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

    static removeAllChildren(elt) {
        while (elt.firstChild) {
            elt.removeChild(elt.firstChild);
        }
    }
}

class CustomExoElement extends HTMLElement {

    constructor() {
        super();
        this.exo_built = false;
        this.exo_build_callbacks = [];
    }

    static exo_counter = 0;

    connectedCallback() {
        if (!this.exo_built) {
            setTimeout(() => {
                let parameters = this.exoGetParameters(this);
                if (!this.exo_built) {
                    this.exoBuild(parameters);
                    this.exo_built = true;
                    this.exoUpdateParameters(parameters);
                }
            }, 0);
        }
    }

    exoGetParameters() {
        let parameters = {};
        this.getAttributeNames().forEach(name => parameters[name] = this.getAttribute(name));
        return parameters;
    }

    exoBuild(tag, parameters) {
        this.exo_element = document.createElement(tag);
        if (parameters["id"]) {
            this.exo_id = parameters["id"];
        } else {
            this.exo_id = "exo"+CustomExoElement.exo_counter;
        }
        CustomExoElement.exo_counter += 1;
        this.exo_element.setAttribute("id",this.exo_id);
        window.setTimeout(() => {
            this.exoBuildComplete();
        },0);
    }

    exoBuildComplete() {
        for(var idx=0; idx<this.exo_build_callbacks.length; idx++) {
            this.exo_build_callbacks[idx]();
        }
        this.exo_build_callbacks = null;
    }

    exoAddBuildCallback(cb) {
        if (this.exo_build_callbacks == null) {
            cb(); // already built, call immediately
        } else {
            // schedule this callback for execution once this
            this.exo_build_callbacks.push(cb);
        }
    }

    exoUpdateParameters(parameters) {
        for(var name in parameters) {
            if (name != "id") {
                this.exoUpdate(name, parameters[name]);
            }
        }
    }

    exoUpdate(name,value) {
        switch(name) {
            case "fg-color":
                ExoUtils.removeClasses( this.exoGetElement(), /exo-(.*)-fg/);
                ExoUtils.addClass(this.exo_element,"exo-"+value+"-fg");
                break;
            case "bg-color":
                ExoUtils.removeClasses(this.exoGetElement(), /exo-(.*)-bg/);
                ExoUtils.addClass(this.exo_element,"exo-"+value+"-bg");
                break;
            case "border":
            case "margin":
            case "padding":
            case "rounded":
            case "vmargin":
            case "hmargin":
                this.applySizedDimension(name,value);
                break;
            case "bg-image":
                if (value) {
                    ExoUtils.addStyle(this.exoGetElement(),"background-image","url('"+value+"');");
                }
                break;
            case "full-width":
                ExoUtils.addClass(this.exoGetElement(),"exo-full-width");
                break;
            default:
                console.log("Unrecognized exoUpdate: "+name+","+value);
        }
    }

    exoGetElement() {
        return this.exo_element;
    }

    exoGetRootElement() {
        return this.exo_element;
    }

    exoGetId() {
        return this.exo_id;
    }

    exoUpdateLabelText(text) {
        this.label.innerHTML = "";
        this.label.appendChild(document.createTextNode(text?text:"\u00A0"));
    }

    static exoGetParameters(element) {
        return {
            "fg-color":element.getAttribute("fg-color"),
            "bg-color":element.getAttribute("bg-color")
        }
    }

    applySizedDimension(name,value) {
        if (value == undefined) {
            return;
        }
        if (value == "") {
            value = "medium";
        }
        ExoUtils.removeClasses(this.exoGetElement(), new RegExp("(exo-)(.*)(-"+name+")"));
        if (value) {
            switch (value) {
                case "no":
                case "small":
                case "medium":
                case "large":
                    ExoUtils.addClass(this.exoGetRootElement(), "exo-" + value + "-" + name);
                    break;
                default:
                    console.log("Exo: Invalid " + name + " value: " + value + ", valid values are no,small,medium,large");
            }
        }
    }

    exoGetAttributeNames() {
        return CustomExoControl.observedAttributes();
    }

    static get observedAttributes() {
        return ["id", "fg-color", "bg-color", "border","margin","padding","rounded","vmargin","hmargin"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.exo_built) {
            this.exoUpdate(name, newValue);
        }
    }
}

class CustomExoContainer extends CustomExoElement {

    constructor() {
        super();
    }

    exoBuild(tag, parameters) {
        super.exoBuild(tag, parameters);
    }
}

/*
   Structure for embedding an exo input control with label, tooltip, and output, layout is:

   <div>
       <label>...</label>     <!-- if exoSetLabel called -->
       <div>...</div>         <!-- if exoSetTooltip called -->
       <output>...</output>   <!-- if exoSetOutputValue called -->
       <br>                   <!-- line break if label or tooltip or output are present -->
       <input type="...">     <!-- the input control or possibly a div containing it -->
   </div>
 */

class CustomExoControl extends CustomExoElement {

    constructor() {
        super();
        this.exo_control_value = undefined;
        this.exo_label = null;
        this.exo_tooltip_div = null;
        this.exo_tooltip_content = null;
        this.exo_br = null;
        this.exo_output = null;
    }

    exoBuild(tag, parameters) {
        super.exoBuild(tag, parameters);

        this.exo_control_value = parameters["value"];

        if (parameters["full_width"]) {
            ExoUtils.addClass(this.exoGetElement(),"exo-full-width");
        }

        this.exo_root_element = document.createElement("div");
        this.exo_root_element.appendChild(this.exo_element);

        if (parameters.label) {
            this.exoUpdateLabel(parameters.label);
        }

        if (parameters.tooltip) {
            this.exoUpdateTooltip(parameters.tooltip);
        }
    }

    exoDefineOutput() {
        if (!this.exo_br) {
            this.exoAddBr();
        }
        this.exo_output = document.createElement("output");
        this.exo_output.setAttribute("for",this.exoGetId());
        this.exoGetElement().parentElement.insertBefore(this.exo_output, this.exo_br);
    }

    exoSetOutputValue(value) {
        if (!this.exo_output) {
            this.exoDefineOutput();
        }
        ExoUtils.removeAllChildren(this.exo_output);
        this.exo_output.appendChild(document.createTextNode(value));
    }

    exoUpdate(name,value) {
        switch(name) {
            case "label":
                this.exoUpdateLabel(value);
                break;
            case "tooltip":
                this.exoUpdateTooltip(value);
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoSetControlValue(value) {
        this.exo_control_value = value;
    }

    exoGetControlValue() {
        return this.exo_control_value;
    }

    exoSetEditable(can_edit) {
        this.exoGetElement().disabled = !can_edit;
    }

    exoGetRootElement() {
        return this.exo_root_element;
    }

    exoUpdateLabel(text) {
        if (!text) {
            if (this.exo_label) {
                this.exo_root_element.removeChild(this.exo_label);
                this.exo_label = null;
            }
            if (!this.exo_tooltip_div && !this.exo_label && !this.exo_output) {
                this.exoRemoveBr();
            }
        } else {
            this.exoAddBr();
            if (!this.exo_label) {
                this.exo_label = document.createElement("label");
                this.exo_label.setAttribute("for", this.exoGetId());
                this.exo_label.setAttribute("style", "display:inline; margin-right:5px;");
                if (this.exo_root_element.firstChild) {
                    this.exo_root_element.insertBefore(this.exo_label, this.exo_root_element.firstChild);
                } else {
                    this.exo_root_element.appendChild(this.exo_label);
                }
            }

            ExoUtils.removeAllChildren(this.exo_label);
            this.exo_label.appendChild(document.createTextNode(text ? text : "\u00A0"));
        }
    }

    exoUpdateTooltip(text) {
        if (!text) {
            if (this.exo_tooltip_div) {
                this.exo_root_element.removeChild(this.exo_tooltip_div);
                this.exo_tooltip_div = null;
                this.exo_tooltip_content = null;
            }
            if (!this.exo_tooltip_div && !this.exo_label && !this.exo_output) {
                this.exoRemoveBr();
            }
        } else {
            this.exoAddBr();
            if (!this.exo_tooltip_div) {
                this.exo_tooltip_div = document.createElement("div");
                this.exo_tooltip_div.setAttribute("tabindex", "0");
                this.exo_tooltip_div.setAttribute("class", "exo-icon exo-icon-help exo-icon-inline exo-help-tooltip");
                this.exo_tooltip_content = document.createElement("div");
                this.exo_tooltip_content.setAttribute("class", "exo-help-content exo-white-bg exo-border");
                this.exo_tooltip_div.appendChild(this.exo_tooltip_content);
                if (this.exo_output) {
                    this.exo_root_element.insertBefore(this.exo_tooltip_div, this.exo_output);
                } else {
                    this.exo_root_element.insertBefore(this.exo_tooltip_div, this.exo_br);
                }
            }
            ExoUtils.removeAllChildren(this.exo_tooltip_content);
            this.exo_tooltip_content.appendChild(document.createTextNode(text));
        }

    }

    exoAddBr() {
        if (!this.exo_br) {
            this.exo_br = document.createElement("br");
            if (this.exo_root_element.firstChild) {
                this.exo_root_element.insertBefore(this.exo_br,this.exo_root_element.firstChild);
            } else {
                this.exo_root_element.appendChild(this.exo_br);
            }
        }
    }

    exoRemoveBr() {
        if (this.exo_br) {
            this.exo_root_element.removeChild(this.exo_br);
            this.exo_br = null;
        }
    }

    exoGetAttributeNames() {
        return CustomExoControl.observedAttributes();
    }

    static get observedAttributes() {
        var attrs = CustomExoElement.observedAttributes;
        attrs.push('label','tooltip');
        return attrs;
    }

}



