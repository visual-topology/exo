/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoElement} from './exo_element.js';
import {ExoUtils} from './exo_utils.js';

export { CustomExoControl };


class CustomExoControl extends CustomExoElement {

    constructor() {
        super();
        this.exo_control_value = undefined;
    }

    exoBuild(tag, parameters) {
        super.exoBuild(tag, parameters);

        this.exo_control_value = parameters["value"];

        if (parameters["full_width"]) {
            ExoUtils.addClass(this.exoGetElement(),"exo-full-width");
        }

        this.exo_root_element = document.createElement("div");

        if (parameters.label) {
            this.label = document.createElement("label");
            this.label.setAttribute("for", this.exoGetId());
            this.label.setAttribute("style", "display:inline; margin-right:5px;");
            this.exo_root_element.appendChild(this.label);
            this.exoUpdateLabelText(parameters.label);

            if (parameters.tooltip) {
                this.tooltip_div = document.createElement("div");
                this.tooltip_div.setAttribute("tabindex", "0");
                this.tooltip_div.setAttribute("class", "exo-icon exo-icon-help exo-icon-inline exo-help-tooltip");
                this.tooltip_content = document.createElement("div");
                this.tooltip_content.setAttribute("class", "exo-help-content exo-white-bg exo-border");
                this.tooltip_content.appendChild(document.createTextNode(parameters.tooltip));
                this.tooltip_div.appendChild(this.tooltip_content);
                this.exo_root_element.appendChild(this.tooltip_div);
            }
            this.exo_root_element.appendChild(document.createElement("br"));
        }

        this.exo_root_element.appendChild(this.exo_element);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "label":
                this.exoUpdateLabelText(value);
                break;

            default:
                console.log("Unrecognized exoUpdate: "+name+","+value);
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

    exoUpdateLabelText(text) {
        if (this.label) {
            this.label.innerHTML = "";
            this.label.appendChild(document.createTextNode(text ? text : "\u00A0"));
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

