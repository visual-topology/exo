/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */


class CustomExoSelect extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("select", parameters);
        this.multiple = parameters.multiple;
        this.exoGetInputElement().setAttribute("class", "select");
        this.options = [];
        var that = this;

        var v = null;
        this.exoGetInputElement().addEventListener("input", evt => {
            if (this.multiple) {
                v = [];
                for (var i = 0; i < this.options.length; i++) {
                    if (this.options[i].element.selected) {
                        v.push(this.options[i].value);
                    }
                }
            } else {
                v = that.exoGetInputElement().value;
            }
            that.dispatchEvent(new CustomEvent("exo-value",{detail:v}));
            evt.stopPropagation();
        });
        this.appendChild(this.exoGetRootElement());
        super.exoBuildComplete(parameters);
    }

    exoUpdate(name, value) {
        switch (name) {
            case "value":
                this.exoGetInputElement().value = value;
                break;
            case "size":
                this.exoGetInputElement().setAttribute("size",value);
                break;
            case "options":
                var options = value.split(";");
                options.map(option => {
                    var delimiter = option.indexOf("=>");
                    if (delimiter > 0) {
                        var name = option.slice(0, delimiter);
                        var label = option.slice(delimiter + 2);
                        this.exoAddOption(name, label);
                    }
                });
                break;
            default:
                super.exoUpdate(name, value);
        }
    }


    exoAddOption(value,label) {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(label));
        option.setAttribute("value", value);
        this.exoGetInputElement().appendChild(option);
        this.options.push({"element": option, "value": value});
    }

    exoGetAttributeNames() {
        return CustomExoSelect.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('options','value');
        return attrs;
    }


}

customElements.define("exo-select", CustomExoSelect);