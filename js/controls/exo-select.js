/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */


class CustomExoSelect extends CustomExoControl {

    constructor() {
        super();
        this.exo_option_labels = {};
        this.exo_current_value = "";
        this.exo_current_label = "";
        this.exo_options = [];
    }

    exoBuild(parameters) {
        super.exoBuildCommon("select", parameters);
        this.exoGetInputElement().setAttribute("class", "select");
        this.exo_options = [];
        var that = this;

        var v = null;
        this.exoGetInputElement().addEventListener("input", evt => {
            v = that.exoGetInputElement().value;
            this.exoManageValidity(v);
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
                this.exoSetControlValue(value);
                this.exoManageValidity(value);
                break;
            case "size":
                this.exoGetInputElement().setAttribute("size",value);
                break;
            case "options":
                let options = JSON.parse(value);
                let current_value = this.exoGetControlValue();
                let current_label = this.exo_option_labels[current_value] || current_value;
                this.exoClearOptions();
                options.map((item) => this.exoAddOption(item[0],item[1]));
                if (!(current_value in this.exo_option_labels)) {
                    this.exoAddOption(current_value, current_label, true);
                }
                this.exoManageValidity(current_value);
                this.exoGetInputElement().value = current_value;
                break;
            default:
                super.exoUpdate(name, value);
        }
    }

    exoManageValidity(v) {
        if (v in this.exo_option_labels) {
            this.exoGetInputElement().setCustomValidity("");
            this.exoRemoveDisabledOptions();
        } else {
            this.exoGetInputElement().setCustomValidity(CustomExoSelect.INVALID_ERROR);
        }
    }

    exoClearOptions() {
        if (this.exoGetInputElement()) {
            ExoUtils.removeAllChildren(this.exoGetInputElement());
        }
        this.exo_option_labels = {};
    }

    exoAddOption(value,label,disabled) {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(label));
        option.setAttribute("value", value);
        if (disabled) {
            option.setAttribute("disabled", "disabled");
        } else {
            this.exo_option_labels[value] = label;
        }
        this.exoGetInputElement().appendChild(option);
        this.exo_options.push({"element": option, "value": value});
    }

    exoRemoveDisabledOptions() {
        this.exo_options = this.exo_options.filter((item) => {
            if (item.element.hasAttribute("disabled") ) {
                item.element.parentNode.removeChild(item.element);
                return false;
            } else {
                return true;
            }
        });
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('options','value');
        return attrs;
    }

}

CustomExoSelect.INVALID_ERROR = "Invalid";

customElements.define("exo-select", CustomExoSelect);