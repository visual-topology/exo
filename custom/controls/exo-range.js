

/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

class CustomExoRange extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild("input", parameters);

        this.exoGetElement().setAttribute("type","range");
        this.exoGetElement().setAttribute("style","display:inline;");

        this.exoGetElement().setAttribute("min", parameters["min"]);
        this.exoGetElement().setAttribute("max", parameters["max"]);

        if ("step" in parameters) {
            this.exoGetElement().setAttribute("step", parameters["step"]);
        }
        this.exoGetElement().value = parameters["value"];

        var that = this;

        this.exoGetElement().oninput = function (evt) {
            const updated_value = that.exoGetElement().value;
            that.exoSetOutputValue(updated_value);
            var v = Number.parseFloat(updated_value);
            that.dispatchEvent(new CustomEvent("exo-value",{detail:v}));
            evt.stopPropagation();
        }
        this.appendChild(this.exoGetRootElement());

        let elt = this.exoGetElement();
        elt.parentNode.insertBefore(document.createTextNode(parameters["min"]),elt);
        elt.parentNode.insertBefore(document.createTextNode(parameters["max"]),elt.nextSibling);

        this.exoSetOutputValue(parameters["value"]);
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

customElements.define("exo-range", CustomExoRange);
