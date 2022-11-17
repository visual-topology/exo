/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoControl} from '../exo_control.mjs';
import {ExoUtils} from '../exo_utils.mjs';

class CustomExoSelectOption extends HTMLElement {
    constructor() {
        super();
    }
}


class CustomExoSelect extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild("select", parameters);
        this.multiple = parameters.multiple;
        this.exoGetElement().setAttribute("class", "select");
        this.options = [];
        var that = this;

        var v = null;
        this.exoGetElement().addEventListener("input", evt => {
            if (this.multiple) {
                v = [];
                for (var i = 0; i < this.options.length; i++) {
                    if (this.options[i].element.selected) {
                        v.push(this.options[i].value);
                    }
                }
            } else {
                v = that.exoGetElement().value;
            }
            that.dispatchEvent(new CustomEvent("exo-value",{detail:v}));
            evt.stopPropagation();
        });
        this.appendChild(this.exoGetRootElement());
        this.exoScan();
    }

    exoUpdate(name, value) {
        switch (name) {
            case "value":
                this.exoGetElement().value = value;
                break;
            case "size":
                this.exoGetElement().setAttribute("size",value);
                break;
            default:
                super.exoUpdate(name, value);
        }
    }

    exoSetOptions(values) {
        for (var idx in this.options) {
            var option = this.options[idx];
            this.exoGetElement().removeChild(option.element);
        }
        this.options = [];
        for (var idx = 0; idx < values.length; idx++) {
            var valid_value = values[idx][0];
            var label = values[idx][1];
            var icon = null;
            if (values[idx].length > 2) {
                icon = values[idx][2];
            }
            this.exoAddOption(valid_value,label,icon);
        }
    }

    exoAddOption(value,label) {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(label));
        option.setAttribute("value", value);
        this.exoGetElement().appendChild(option);
        this.options.push({"element": option, "value": value});
    }

    exoGetAttributeNames() {
        return CustomExoSelect.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value');
        return attrs;
    }

    exoScan() {
        for(var idx=0; idx<this.childNodes.length; idx++) {
            var node = this.childNodes[idx];
            this.exoAddNodeCallback(node);
        }
    }

    exoAddNodeCallback(node) {
        if (node.nodeType == Node.ELEMENT_NODE && node.tagName == "EXO-SELECT-OPTION") {
            var value = node.getAttribute("value");
            var label = node.getAttribute("label") || value;
            this.exoAddOption(value,label);
        }

    }
}

customElements.define("exo-select-option", CustomExoSelectOption);
customElements.define("exo-select", CustomExoSelect);