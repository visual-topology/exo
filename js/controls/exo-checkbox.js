/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class CustomExoCheckbox extends CustomExoControl {
    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);

        this.exoGetInputElement().setAttribute("type","checkbox");

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetInputElement().checked = (value == "true") ? true : false;
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoCheckbox.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value');
        return attrs;
    }
}

customElements.define("exo-checkbox", CustomExoCheckbox);
