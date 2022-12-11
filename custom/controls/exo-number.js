/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

class CustomExoNumber extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild("input", parameters);

        this.exoGetElement().setAttribute("type","number");
        if ("min" in parameters) {
            this.exoGetElement().setAttribute("min", parameters["min"]);
        }
        if ("max" in parameters) {
            this.exoGetElement().setAttribute("max", parameters["max"]);
        }
        if ("step" in parameters) {
            this.exoGetElement().setAttribute("step", parameters["step"]);
        }
        if ("value" in parameters) {
            this.exoGetElement().value = parameters["value"];
        } else {
            this.getExoElement().value = 0;
        }

        var that = this;

        this.exoGetElement().oninput = function (evt) {
            var v = Number.parseFloat(that.exoGetElement().value);
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
        return CustomExoNumber.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','min','max','step');
        return attrs;
    }
}

customElements.define("exo-number", CustomExoNumber);
