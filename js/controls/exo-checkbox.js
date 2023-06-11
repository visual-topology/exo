/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class CustomExoCheckbox extends CustomExoControl {
    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);

        this.exoGetInputElement().setAttribute("type","checkbox");
        this.exoGetInputElement().addEventListener("change", evt => {
            let v = evt.target.checked;
            this.exoSetControlValue(v?"true":"false");
            this.checked = v;
            this.dispatchEvent(new CustomEvent("change"));
            evt.stopPropagation();
        });

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                const bvalue = (value == "true") ? true : false;
                this.exoGetInputElement().checked = bvalue;
                this.exoSetControlValue(value);
                this.checked = bvalue;
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

customElements.define("exo-checkbox", CustomExoCheckbox);
