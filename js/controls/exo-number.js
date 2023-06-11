/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class CustomExoNumber extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);

        this.exoGetInputElement().setAttribute("type","number");

         this.exoGetInputElement().addEventListener("change", evt => {
            let v = evt.target.value;
            this.exoSetControlValue(v);
            this.dispatchEvent(new CustomEvent("change"));
            evt.stopPropagation();
        });

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "min":
                this.exoGetInputElement().setAttribute("min", value);
                break;
            case "max":
                this.exoGetInputElement().setAttribute("max", value);
                break;
            case "step":
                this.exoGetInputElement().setAttribute("step", value);
                break;
            case "value":
                this.exoGetInputElement().value = value;
                this.exoSetControlValue(value);
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','min','max','step');
        return attrs;
    }
}

customElements.define("exo-number", CustomExoNumber);
