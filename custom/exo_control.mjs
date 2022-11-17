/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoElement} from './exo_element.mjs';
import {ExoUtils} from './exo_utils.mjs';

export { CustomExoControl };

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

