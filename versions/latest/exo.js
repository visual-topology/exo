/* js/exo-common.js */

/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

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
        return ["fg-color", "bg-color", "border-color", "border","margin","padding","rounded","vmargin","hmargin","label","tooltip"];
    }

    addEventListener(type, listener, options) {
        if (!type.startsWith("exo")) {
            return this.exoGetInputElement().addEventListener(type, listener, options);
        } else {
            return super.addEventListener(type,listener,options);
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
            default:
                console.log("Unrecognized exoUpdate: "+name+","+value);
        }
    }

    exoGetInputElement() {
        return this.exo_element;
    }

    exoUpdateLabelText(text) {
        this.label.innerHTML = "";
        this.label.appendChild(document.createTextNode(text?text:"\u00A0"));
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
    }

    exoGetControlValue() {
        return this.exo_control_value;
    }

    exoSetEditable(can_edit) {
        this.exoGetInputElement().disabled = !can_edit;
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





/* js/controls/exo-button.js */



class CustomExoButton extends CustomExoControl {
    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon(parameters["text"] ? "input" : "button", parameters);
        if (parameters["text"]) {
            this.exoGetInputElement().setAttribute("type","button");
            this.exoGetInputElement().setAttribute("value", parameters["text"]);
        } else {
            ExoUtils.addClass(this.exoGetInputElement(),"exo-icon " + parameters["icon"]);
        }

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "text":
                if (this.exoGetInputElement()) {
                    this.exoGetInputElement().setAttribute("value", value);
                }
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoButton.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('text');
        return attrs;
    }
}

customElements.define("exo-button", CustomExoButton);



/* js/controls/exo-checkbox.js */


class CustomExoCheckbox extends CustomExoControl {
    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);

        this.exoGetInputElement().setAttribute("type","checkbox");

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetInputElement().checked = (value == "true") ? true : false;
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoCheckbox.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value');
        return attrs;
    }
}

customElements.define("exo-checkbox", CustomExoCheckbox);


/* js/controls/exo-date.js */


class CustomExoDateTimeBase extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters,input_type) {
        super.exoBuildCommon("input", parameters);

        this.exoGetInputElement().setAttribute("type",input_type);

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetInputElement().value = value;
                break;
            case "min":
                this.exoGetInputElement().setAttribute("min", value);
                break;
            case "max":
                this.exoGetInputElement().setAttribute("max", value);
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoDateTimeBase.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','min','max');
        return attrs;
    }
}

class CustomExoDate extends CustomExoDateTimeBase {

    constructor() {
        super();
    }

    exoBuild(parameters, type) {
        super.exoBuild(parameters,"date");
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','min','max');
        return attrs;
    }
}

class CustomExoTime extends CustomExoDateTimeBase {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild(parameters, "time");
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','min','max');
        return attrs;
    }
}

class CustomExoDateTimeLocal extends CustomExoDateTimeBase {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild(parameters, "datetime-local");
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','min','max');
        return attrs;
    }
}

customElements.define("exo-date", CustomExoDate);
customElements.define("exo-time", CustomExoTime);
customElements.define("exo-datetime-local", CustomExoDateTimeLocal);




/* js/controls/exo-file.js */


class CustomExoFile extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);
        this.exoGetInputElement().setAttribute("type","file");
        var that = this;

        this.exoGetInputElement().oninput = function (evt) {
            const filelist = that.exoGetInputElement().files;
            var files = {};
            for(var idx=0; idx<filelist.length;idx++) {
                var file = filelist[idx];
                files[file.name] = file;
            }
            that.dispatchEvent(new CustomEvent("exo-file-changed",{detail:files}));
        }
        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoFile.observedAttributes;
    }

    static get observedAttributes() {
        return CustomExoControl.observedAttributes;
    }
/*
    async upload(filelist, callback) {
        var uploaded = {};
        for (var idx = 0; idx < filelist.length; idx++) {
            await this.upload_file(filelist[idx], uploaded);
        }
        callback(uploaded);
    }

    async upload_file(file, uploaded) {
        var that = this;
        var ab = await file.arrayBuffer();
        var dec = new TextDecoder();
        uploaded[file.name] = dec.decode(ab);
    }
*/
}

customElements.define("exo-file", CustomExoFile);


/* js/controls/exo-number.js */


class CustomExoNumber extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);

        this.exoGetInputElement().setAttribute("type","number");

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetInputElement().value = value;
                break;
            case "min":
                this.exoGetInputElement().setAttribute("min", value);
                break;
            case "max":
                this.exoGetInputElement().setAttribute("max", value);
                break;
            case "step":
                this.exoGetInputElement().setAttribute("step", value);
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoNumber.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','min','max','step');
        return attrs;
    }
}

customElements.define("exo-number", CustomExoNumber);


/* js/controls/exo-radio.js */


class CustomExoRadio extends CustomExoControl {
    constructor() {
        super();
        this.exo_button_count = 0;
        this.exo_button_map = {};
        this.exo_radio_name = "";
    }

    exoBuild(parameters) {
        super.exoBuildCommon("div", parameters);
        this.exo_radio_name = this.exoGetId()+"_rbg";
        this.appendChild(this.exoGetRootElement());
        super.exoBuildComplete(parameters);
    }

    exoUpdate(name, value) {
        switch (name) {
            case "value":
                this.exoSetControlValue(value);
                this.exoControlValueUpdated();
                break;
            case "options":
                var options = value.split(";");
                options.map(option => {
                    var delimiter = option.indexOf("=>");
                    if (delimiter > 0) {
                        var name = option.slice(0, delimiter);
                        var label = option.slice(delimiter + 2);
                        this.addRadioButton(name, label);
                    }
                });
                break;
            default:
                super.exoUpdate(name, value);
        }
    }

    exoControlValueUpdated() {
        var value = this.exoGetControlValue();
        var radios = document.getElementsByName(this.exo_radio_name);
        for(var idx=0; idx<radios.length; idx++) {
            if (radios[idx].value == value) {
                radios[idx].checked = true;
            }
        }
    }

    addRadioButton(value,label_text) {

        var btn_id = this.exoGetId()+"_b"+this.exo_button_count;
        this.exo_button_count += 1;

        var label = document.createElement("label");
        ExoUtils.addStyle(label,"display","inline-block");
        label.setAttribute("for",btn_id);
        var span = document.createElement("span");
        ExoUtils.addClass(span,"label-body");
        span.appendChild(document.createTextNode(label_text));
        label.appendChild(span);
        var input = document.createElement("input");
        input.setAttribute("id",btn_id);
        input.setAttribute("type","radio");
        input.setAttribute("name", this.exo_radio_name);
        input.setAttribute("value",value);

        this.exo_button_map[value] = input;

        this.exoGetInputElement().appendChild(label);
        this.exoGetInputElement().appendChild(input);

        input.addEventListener("input", evt => {
            this.exoSetControlValue(value);
            this.dispatchEvent(new CustomEvent("exo-value", {detail: value}));
            evt.stopPropagation();
        });
    }

    exoGetAttributeNames() {
        return CustomExoRadio.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('options','value');
        return attrs;
    }


}

customElements.define("exo-radio", CustomExoRadio);

/* js/controls/exo-range.js */




class CustomExoRange extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);

        this.exoGetInputElement().setAttribute("type","range");
        this.exoGetInputElement().setAttribute("style","display:inline;");

        this.exoGetInputElement().setAttribute("min", parameters["min"]);
        this.exoGetInputElement().setAttribute("max", parameters["max"]);

        if ("step" in parameters) {
            this.exoGetInputElement().setAttribute("step", parameters["step"]);
        }
        this.exoGetInputElement().value = parameters["value"];

        var that = this;

        this.exoGetInputElement().oninput = function (evt) {
            const updated_value = that.exoGetInputElement().value;
            that.exoSetOutputValue(updated_value);
            var v = Number.parseFloat(updated_value);
            that.dispatchEvent(new CustomEvent("exo-value",{detail:v}));
            evt.stopPropagation();
        }

        let elt = this.exoGetInputElement();
        elt.parentNode.insertBefore(document.createTextNode(parameters["min"]),elt);
        elt.parentNode.insertBefore(document.createTextNode(parameters["max"]),elt.nextSibling);

        this.exoSetOutputValue(parameters["value"]);

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetInputElement().value = value;
                break;
            case "min":
                this.exoGetInputElement().setAttribute("min", value);
                break;
            case "max":
                this.exoGetInputElement().setAttribute("max", value);
                break;
            case "step":
                this.exoGetInputElement().setAttribute("step", value);
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoNumber.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','min','max','step');
        return attrs;
    }
}

customElements.define("exo-range", CustomExoRange);


/* js/controls/exo-select.js */



class CustomExoSelect extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("select", parameters);
        this.multiple = parameters.multiple;
        this.exoGetInputElement().setAttribute("class", "select");
        this.options = [];
        var that = this;

        var v = null;
        this.exoGetInputElement().addEventListener("input", evt => {
            if (this.multiple) {
                v = [];
                for (var i = 0; i < this.options.length; i++) {
                    if (this.options[i].element.selected) {
                        v.push(this.options[i].value);
                    }
                }
            } else {
                v = that.exoGetInputElement().value;
            }
            that.dispatchEvent(new CustomEvent("exo-value",{detail:v}));
            evt.stopPropagation();
        });
        this.appendChild(this.exoGetRootElement());
        super.exoBuildComplete(parameters);
    }

    exoUpdate(name, value) {
        switch (name) {
            case "value":
                this.exoGetInputElement().value = value;
                break;
            case "size":
                this.exoGetInputElement().setAttribute("size",value);
                break;
            case "options":
                var options = value.split(";");
                options.map(option => {
                    var delimiter = option.indexOf("=>");
                    if (delimiter > 0) {
                        var name = option.slice(0, delimiter);
                        var label = option.slice(delimiter + 2);
                        this.exoAddOption(name, label);
                    }
                });
                break;
            default:
                super.exoUpdate(name, value);
        }
    }


    exoAddOption(value,label) {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(label));
        option.setAttribute("value", value);
        this.exoGetInputElement().appendChild(option);
        this.options.push({"element": option, "value": value});
    }

    exoGetAttributeNames() {
        return CustomExoSelect.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('options','value');
        return attrs;
    }


}

customElements.define("exo-select", CustomExoSelect);

/* js/controls/exo-text.js */


class CustomExoText extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);

        this.exoGetInputElement().setAttribute("type","text");
        this.exoGetInputElement().value = parameters["value"] || "";

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetInputElement().value = value;
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoText.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value');
        return attrs;
    }
}

customElements.define("exo-text", CustomExoText);


/* js/controls/exo-textarea.js */


class CustomExoTextArea extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("textarea", parameters);

        var that = this;

        this.exoGetInputElement().onchange = function (evt) {
            var v = that.exoGetInputElement().value;
            that.dispatchEvent(new CustomEvent("exo-value",{detail:v}));
            evt.stopPropagation();
        }

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetInputElement().value = value;
                break;
            case "rows":
            case "cols":
                this.exoGetInputElement().setAttribute(name,value);
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoTextArea.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','rows','cols');
        return attrs;
    }
}

customElements.define("exo-textarea", CustomExoTextArea);


/* js/controls/exo-toggle.js */


class CustomExoToggle extends CustomExoControl {
    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);

        var element = this.exoGetInputElement();
        element.setAttribute("type","checkbox");

        var label = document.createElement("label");
        label.setAttribute("class","exo-toggle");
        var parent = element.parentElement;
        parent.removeChild(element);
        var span = document.createElement("span");
        span.setAttribute("class","exo-toggle-slide");
        label.appendChild(element);
        span.appendChild(document.createTextNode(""));
        label.appendChild(span);
        parent.appendChild(label);

        this.label = label;
        this.tt_span = null;
        this.ft_span = null;

        this.slider_span = span;

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetInputElement().checked = value;
                break;
            case "true-text":
                if (!this.tt_span) {
                    this.tt_span = document.createElement("span");
                    this.tt_span.setAttribute("class", "exo-toggle-true");
                    this.label.appendChild(this.tt_span);
                }
                ExoUtils.removeAllChildren(this.tt_span);
                if (value) {
                    this.tt_span.appendChild(document.createTextNode(value));
                }
                break;
            case "false-text":
                 if (!this.ft_span) {
                    this.ft_span = document.createElement("span");
                    this.ft_span.setAttribute("class", "exo-toggle-false");
                    this.label.appendChild(this.ft_span);
                }
                ExoUtils.removeAllChildren(this.ft_span);
                if (value) {
                    this.ft_span.appendChild(document.createTextNode(value));
                }
                break;
            case "fg-color":
                ExoUtils.removeClasses( this.slider_span, /(exo-)(.*)(-fg)/);
                ExoUtils.addClass(this.slider_span,"exo-"+value+"-fg");
                break;
            case "bg-color":
                ExoUtils.removeClasses(this.slider_span, /(exo-)(.*)(-bg)/);
                ExoUtils.addClass(this.slider_span,"exo-"+value+"-bg");
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoToggle.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value');
        attrs.push('true_text');
        attrs.push('false_text');
        return attrs;
    }
}

customElements.define("exo-toggle", CustomExoToggle);


/* js/controls/exo-download.js */


class CustomExoDownload extends CustomExoControl {

    constructor() {
        super();
        this.exo_download_content = null;
        this.exo_download_mimetype = null;
        this.exo_download_href = null;
        this.exo_download_filename = null;
        this.exo_a = null;
    }

    exoBuild(parameters) {
        super.exoBuildCommon("div", parameters);
        this.exoGetInputElement().setAttribute("class","exo-button");

        this.exo_a = document.createElement("a");
        this.exo_a.setAttribute("href","");
        this.exoGetInputElement().appendChild(this.exo_a);
        var that = this;

        this.exo_a.onclick = function (evt) {
            that.dispatchEvent(new CustomEvent("exo-download",{"detail":{}}));
            that.exoSetHref();
        }
        super.exoBuildComplete(parameters);
    }

    exoSetHref() {
        if (!this.exo_download_href) {
            var data_uri = "data:" + this.exo_download_mimetype + ";base64," + btoa(this.exo_download_content);
            this.exo_a.setAttribute("href", data_uri);
        }
    }

    exoUpdate(name,value) {
        switch(name) {
            case "download_filename":
                this.exo_download_filename = value;
                this.exo_a.setAttribute("download", value);
                ExoUtils.removeAllChildren(this.exo_a);
                this.exo_a.appendChild(document.createTextNode(value));
                break;
            case "download_mimetype":
            case "download_content":
                if (name == "download_mimetype") {
                    this.exo_download_mimetype = value;
                } else {
                    this.exo_download_content = value;
                }
                if (this.exo_download_mimetype && this.exo_download_content) {
                    this.exo_download_href = "";
                    this.exo_a.setAttribute("href", this.exo_download_href);
                }
                break;
            case "href":
                this.exo_download_href = value;
                this.exo_a.setAttribute("href", this.exo_download_href);
                break;
            case "fg-color":
                // apply the color to the anchor to override the default link style
                ExoUtils.removeClasses( this.exo_a, /exo-(.*)-fg/);
                ExoUtils.addClass(this.exo_a,"exo-"+value+"-fg");
                super.exoUpdate(name,value);
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoFile.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push("download_filename");
        attrs.push("download_content");
        attrs.push("download_mimetype");
        attrs.push("href");
        return attrs;
    }

}

customElements.define("exo-download", CustomExoDownload);

