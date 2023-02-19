/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class CustomExoTextArea extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("textarea", parameters);

        var that = this;

        this.exoGetInputElement().onchange = function (evt) {
            var v = that.exoGetInputElement().value;
            that.dispatchEvent(new CustomEvent("exo-value",{detail:v}));
            evt.stopPropagation();
        }

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetInputElement().value = value;
                break;
            case "rows":
            case "cols":
                this.exoGetInputElement().setAttribute(name,value);
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoTextArea.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','rows','cols');
        return attrs;
    }
}

customElements.define("exo-textarea", CustomExoTextArea);
