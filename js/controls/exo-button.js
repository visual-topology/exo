/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */


class CustomExoButton extends CustomExoControl {
    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);
        this.exoGetInputElement().setAttribute("type","button");
        if (parameters["text"]) {
            this.exoGetInputElement().setAttribute("value", parameters["text"]);
        }
        if (parameters["icon"]) {
            ExoUtils.addClass(this.exoGetInputElement(),"exo-icon exo-icon-" + parameters["icon"]);
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

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('text');
        return attrs;
    }
}

customElements.define("exo-button", CustomExoButton);

