/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class CustomExoText extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);

        this.exoGetInputElement().setAttribute("type","text");
        this.exoGetInputElement().value = parameters["value"] || "";

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
        attrs.push('value');
        return attrs;
    }
}

customElements.define("exo-text", CustomExoText);
