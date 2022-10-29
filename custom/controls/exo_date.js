/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoControl} from '../exo_control.js';


class CustomExoDate extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild("input", parameters);

        this.exoGetElement().setAttribute("type","date");
        if ("min" in parameters) {
            this.exoGetElement().setAttribute("min", parameters["min"]);
        }
        if ("max" in parameters) {
            this.exoGetElement().setAttribute("max", parameters["max"]);
        }
        if ("value" in parameters) {
            this.exoGetElement().value = parameters["value"];
        } else {
            this.getExoElement().value = 0;
        }

        var that = this;

        this.exoGetElement().oninput = function (evt) {
            var v = new Date(that.exoGetElement().value+"Z"); // UTC
            that.dispatchEvent(new CustomEvent("exo-value",{detail:v}));
            evt.stopPropagation();
        }
        this.appendChild(this.exoGetRootElement());
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetElement().value = value;
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoDate.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','min','max');
        return attrs;
    }
}

customElements.define("exo-date", CustomExoDate);
