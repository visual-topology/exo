/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoControl} from '../exo_control.js';
import {ExoUtils} from '../exo_utils.js';

class CustomExoRadioButton extends HTMLElement {
    constructor() {
        super();
    }
}


class CustomExoRadio extends CustomExoControl {
    constructor() {
        super();
        this.exo_button_count = 0;
        this.exo_button_map = {};
        this.exo_radio_name = "";
    }

    exoBuild(parameters) {
        super.exoBuild("div", parameters);
        this.exo_radio_name = this.exoGetId()+"_rbg";
        this.appendChild(this.exoGetRootElement());
        this.scan();

        console.log(this.exo_radio_node_list);
        var that = this;
        if (parameters["value"]) {
            this.exoUpdate("value",parameters["value"]);
        }
        var radios = document.getElementsByName(this.exo_radio_name);
        for(var idx=0; idx<radios.length; idx++) {
            radios[idx].addEventListener("input", evt => {
                var value = evt.target.value;
                that.exoSetControlValue(value);
                that.dispatchEvent(new CustomEvent("exo-value", {detail: value}));
                evt.stopPropagation();
            });
        }
        /* this.exo_radio_node_list.addEventListener("input", function (evt) {

        }); */

    }

    exoUpdate(name, value) {
        switch (name) {
            case "value":
                this.exoSetControlValue(value);
                this.exoControlValueUpdated();
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

    addButton(value,label_text) {

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

        this.exoGetElement().appendChild(label);
        this.exoGetElement().appendChild(input);
    }

    exoGetAttributeNames() {
        return CustomExoRadio.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value');
        return attrs;
    }

    scan() {
        for(var idx=0; idx<this.childNodes.length; idx++) {
            var node = this.childNodes[idx];
            this.addNodeCallback(node);
        }
    }

    addNodeCallback(node) {
        if (node.nodeType == Node.ELEMENT_NODE && node.tagName == "EXO-RADIO-BUTTON") {
            var value = node.getAttribute("value");
            var label = node.getAttribute("label") || value;
            this.addButton(value,label);
        }

    }
}

customElements.define("exo-radio-button", CustomExoRadioButton);
customElements.define("exo-radio", CustomExoRadio);