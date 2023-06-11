/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class CustomExoTextArea extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("textarea", parameters);

        var that = this;

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
            case "rows":
            case "cols":
                this.exoGetInputElement().setAttribute(name,value);
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','rows','cols');
        return attrs;
    }
}

customElements.define("exo-textarea", CustomExoTextArea);
