/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

class CustomExoTextArea extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild("textarea", parameters);

        var that = this;

        this.exoGetElement().onchange = function (evt) {
            var v = that.exoGetElement().value;
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
            case "rows":
            case "cols":
                this.exoGetElement().setAttribute(name,value);
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
