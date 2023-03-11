/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */


class CustomExoSelect extends CustomExoControl {

    constructor() {
        super();
        this.exo_option_labels = {};
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
            that.exoSetControlValue(v);
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
                let options = JSON.parse(value);
                this.exoClearOptions();
                options.map((item) => this.exoAddOption(item[0],item[1]));
                if (!(this.value in this.exo_option_labels)) {
                    this.exoSetControlValue(null);
                }
                break;
            default:
                super.exoUpdate(name, value);
        }
    }

    exoClearOptions() {
        if (this.exoGetInputElement()) {
            ExoUtils.removeAllChildren(this.exoGetInputElement());
        }
        this.exo_option_labels = {};
    }

    exoAddOption(value,label) {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(label));
        option.setAttribute("value", value);
        this.exoGetInputElement().appendChild(option);
        this.options.push({"element": option, "value": value});
        this.exo_option_labels[value] = label;
    }

    exoGetLabel(value) {
        return this.exo_option_labels[value];
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