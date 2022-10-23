/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoControl} from '../exo_control.js';
import {ExoUtils} from '../exo_utils.js';

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
        this.exoGetElement().addEventListener("input", function () {
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
        this.scan();
    }

    exoUpdate(name, value) {
        switch (name) {
            case "value":
                this.exoGetElement().value = value;
                break;
            default:
                super.exoUpdate(name, value);
        }
    }

    setOptions(values) {
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
            this.addOption(valid_value,label,icon);
        }
    }

    addOption(value,label,icon) {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(label));
        option.setAttribute("value", value);
        if (icon) {
            option.setAttribute("class", "exo-icon exo-icon-" + icon);
        }
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

    scan() {
        for(var idx=0; idx<this.childNodes.length; idx++) {
            var node = this.childNodes[idx];
            this.addNodeCallback(node);
        }
    }

    /*
    setupMonitoring() {
        const config = {childList: true};
        var that = this;
        const callback = (mutationList, observer) => {

            for (const mutation of mutationList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => that.addNodeCallback(node));
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(this, config);
    } */

    addNodeCallback(node) {
        if (node.nodeType == Node.ELEMENT_NODE && node.tagName == "EXO-SELECT-OPTION") {
            var value = node.getAttribute("value");
            var label = node.getAttribute("label") || value;
            var icon = node.getAttribute("icon");
            this.addOption(value,label,icon);
            // this.removeChild(node);
        }

    }
}

customElements.define("exo-select-option", CustomExoSelectOption);
customElements.define("exo-select", CustomExoSelect);