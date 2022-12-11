/* MIT License - Exo - Copyright (c) 2022 Visual Topology */


class CustomExoButton extends CustomExoControl {
    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild(parameters["text"] ? "input" : "button", parameters);
        if (parameters["text"]) {
            this.exoGetElement().setAttribute("type","button");
            this.exoGetElement().setAttribute("value", parameters["text"]);
        } else {
            ExoUtils.addClass(this.exoGetElement(),"exo-icon " + parameters["icon"]);
        }

        var that = this;
        this.exoGetElement().onclick = function (evt) {
            that.dispatchEvent(new CustomEvent("exo-click",{detail:{}}));
            evt.stopPropagation();
        }
        this.appendChild(this.exoGetRootElement());
    }

    exoUpdate(name,value) {
        switch(name) {
            case "text":
                if (this.exoGetElement()) {
                    this.exoGetElement().setAttribute("value", value);
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

