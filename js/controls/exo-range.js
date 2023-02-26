

/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

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
