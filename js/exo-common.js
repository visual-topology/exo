/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class ExoUtils {

    static addClasses(element, classnames) {
        classnames.forEach(classname => ExoUtils.addClass(element, classname));
    }

    static addClass(element, classname) {
        var classes = (element.getAttribute("class") || "").split(" ");
        var classnames = classname.split(" ");
        for(let idx=0; idx<classnames.length; idx++) {
            let cls = classnames[idx];
            if (classes.findIndex(name => name == cls) == -1) {
                classes.push(cls);
            }
        }
        var new_classes = classes.join(" ")
        element.setAttribute("class", new_classes);
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

var exo_counter = 0;

class CustomExoControl extends HTMLElement {

    constructor() {
        super();
        this.exo_control_value = undefined;
        this.exo_label = null;
        this.exo_tooltip_div = null;
        this.exo_tooltip_content = null;
        this.exo_br = null;
        this.exo_output = null;
        this.exo_id = "s"+exo_counter;
        exo_counter += 1;
        this.exo_built = false;
        this.pending_event_listeners = [];
    }

    exoGetId() {
        return this.exo_id;
    }

    connectedCallback() {
       let parameters = this.exoGetParameters(this);
       this.exoBuild(parameters);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.exo_built) {
            this.exoUpdate(name, newValue);
        }
    }

    static get observedAttributes() {
        return ["fg-color", "bg-color", "border-color", "border","margin","padding","rounded",
            "vmargin","hmargin","label","tooltip","disabled","class","aria-label", "visible"];
    }

    addEventListener(type, listener, options) {
        if (!this.exo_built) {
            this.pending_event_listeners.push([type, listener, options]);
        } else {
            this.exoAttachEventListener(type, listener, options);
        }
    }

    exoAttachEventListener(type, listener, options) {
        if (!type.startsWith("exo")) {
            return this.exoGetInputElement().addEventListener(type, listener, options);
        } else {
            return super.addEventListener(type, listener, options);
        }
    }

    removeEventListener(type, listener, options) {
        if (!type.startsWith("exo")) {
            return this.exoGetInputElement().addRemoveEventListener(type, listener, options);
        } else {
            return super.addEventListener(type,listener,options);
        }
    }

    exoGetAttributeNames() {
        return CustomExoControl.observedAttributes();
    }

    exoBuildCommon(tag, parameters) {

        this.exo_element = document.createElement(tag);

        if (parameters["full_width"]) {
            ExoUtils.addClass(this.exoGetInputElement(),"exo-full-width");
        }

        this.exo_root_element = document.createElement("div");
        this.exo_root_element.appendChild(this.exo_element);

        this.exo_built = true;
    }

    exoBuildComplete(parameters) {
        for(var parameter_name in parameters) {
            this.exoUpdate(parameter_name,parameters[parameter_name]);
        }
        this.appendChild(this.exoGetRootElement());
        for(var idx=0; idx<this.pending_event_listeners.length; idx++) {
            var pending = this.pending_event_listeners[idx];
            this.exoAttachEventListener(pending[0],pending[1],pending[2]);
        }
    }

    exoGetParameters() {
        let parameters = {};
        this.getAttributeNames().forEach(name => parameters[name] = this.getAttribute(name));
        return parameters;
    }

    exoUpdateParameters(parameters) {
        for(var name in parameters) {
            this.exoUpdate(name, parameters[name]);
        }
    }

    exoUpdate(name,value) {
        if (!this.exo_built) {
            return;
        }
        switch(name) {
            case "fg-color":
                ExoUtils.removeClasses( this.exoGetInputElement(), /exo-(.*)-fg/);
                ExoUtils.addClass(this.exoGetInputElement(),"exo-"+value+"-fg");
                break;
            case "bg-color":
                ExoUtils.removeClasses(this.exoGetInputElement(), /exo-(.*)-bg/);
                ExoUtils.addClass(this.exoGetInputElement(),"exo-"+value+"-bg");
                break;
            case "border-color":
                ExoUtils.removeClasses(this.exoGetInputElement(), /exo-(.*)-border/);
                ExoUtils.addClass(this.exoGetInputElement(),"exo-"+value+"-border");
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
                    ExoUtils.addStyle(this.exoGetInputElement(),"background-image","url('"+value+"');");
                }
                break;
            case "full-width":
                ExoUtils.addClass(this.exoGetInputElement(),"exo-full-width");
                break;
            case "label":
                this.exoUpdateLabel(value);
                break;
            case "tooltip":
                this.exoUpdateTooltip(value);
                break;
            case "id":
                // ignore
                break;
            case "class":
                ExoUtils.addClass(this.exoGetInputElement(),value);
                break;
            case "disabled":
                switch(value) {
                    case "true":
                        this.exoGetInputElement().setAttribute("disabled", "disabled");
                        break;
                    case "false":
                        this.exoGetInputElement().removeAttribute("disabled");
                        break;
                }
                break;
            case "visible":
                switch(value) {
                    case "true":
                        ExoUtils.addStyle(this.exoGetRootElement(),"visibility", "visible");
                        break;
                    case "false":
                        ExoUtils.addStyle(this.exoGetRootElement(),"visibility", "hidden");
                        break;
                }
                break;
            case "aria-label":
                this.exoGetInputElement().setAttribute(name,value);
                break;
            default:
                console.log("Unrecognized exoUpdate: "+name+","+value);
        }
    }

    exoGetInputElement() {
        return this.exo_element;
    }

    applySizedDimension(name,value) {
        if (value == undefined) {
            return;
        }
        if (value == "") {
            value = "medium";
        }
        ExoUtils.removeClasses(this.exoGetInputElement(), new RegExp("(exo-)(.*)(-"+name+")"));
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


    exoDefineOutput() {
        if (!this.exo_br) {
            this.exoAddBr();
        }
        this.exo_output = document.createElement("output");
        this.exo_output.setAttribute("for",this.exoGetId());
        this.exoGetInputElement().parentElement.insertBefore(this.exo_output, this.exo_br);
    }

    exoSetOutputValue(value) {
        if (!this.exo_output) {
            this.exoDefineOutput();
        }
        ExoUtils.removeAllChildren(this.exo_output);
        this.exo_output.appendChild(document.createTextNode(value));
    }


    exoSetControlValue(value) {
        this.exo_control_value = value;
        this.value = value;
    }

    exoGetControlValue() {
        return this.exo_control_value;
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
}



