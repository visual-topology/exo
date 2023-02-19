/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */


class CustomExoButton extends CustomExoControl {
    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon(parameters["text"] ? "input" : "button", parameters);
        if (parameters["text"]) {
            this.exoGetInputElement().setAttribute("type","button");
            this.exoGetInputElement().setAttribute("value", parameters["text"]);
        } else {
            ExoUtils.addClass(this.exoGetInputElement(),"exo-icon " + parameters["icon"]);
        }

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "text":
                if (this.exoGetInputElement()) {
                    this.exoGetInputElement().setAttribute("value", value);
                }
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoButton.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('text');
        return attrs;
    }
}

customElements.define("exo-button", CustomExoButton);

