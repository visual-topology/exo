/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */


class CustomExoSelect extends CustomExoControl {

    constructor() {
        super();
        this.exo_value_label_map = {};
        this.exo_is_multiple = false;
    }

    exoBuild(parameters) {

        super.exoBuildCommon("select", parameters);
        this.exoGetInputElement().setAttribute("class", "select");

        this.exoGetInputElement().addEventListener("change", evt => {
            let v = undefined;
            if (this.exo_is_multiple) {
                var selected_values = [];
                var options = this.exoGetInputElement().querySelectorAll("option");
                for (var i=0; i<options.length; i++) {
                    let opt = options[i];
                    if (opt.selected) {
                        selected_values.push(opt.value);
                    }
                }
                v = JSON.stringify(selected_values);
            } else {
                v = this.exoGetInputElement().value;
            }
            this.exoSetControlValue(v);
            this.dispatchEvent(new CustomEvent("change"));
            evt.stopPropagation();
        });
        this.appendChild(this.exoGetRootElement());

        if ("multiple" in parameters) {
            this.exo_is_multiple = true;
            delete parameters["multiple"];
            this.exoGetInputElement().setAttribute("multiple","multiple");
        }
        if ("options" in parameters) {
            this.exoSetOptions(parameters["options"]);
            delete parameters["options"];
        }
        super.exoBuildComplete(parameters);
    }

    exoUpdate(name, value) {
        switch (name) {
            case "value":
                if (this.exo_is_multiple) {
                    let value_arr = [];
                    if (value) {
                        value_arr = JSON.parse(value);
                    }
                    let options = this.exoGetInputElement().querySelectorAll("option");
                    for (var i=0; i<options.length; i++) {
                        let opt = options[i];
                        if (value_arr.includes(opt.value)) {
                            opt.selected = true;
                        } else {
                            opt.selected = false;
                        }
                    }
                    this.exoSetControlValue(value);
                } else {
                    this.exoGetInputElement().value = value;
                    this.exoSetControlValue(value);
                }
                break;
            case "size":
                this.exoGetInputElement().setAttribute("size",value);
                break;
            case "options":
                this.exoSetOptions(value);
                break;
            default:
                super.exoUpdate(name, value);
        }
    }

    exoSetOptions(value) {
        let options = JSON.parse(value);
        let current_value = this.exoGetControlValue();
        this.exoClearOptions();
        options.map((item) => this.exoAddOption(item[0],item[1]));
        let updated_value = undefined;
        if (!this.exo_is_multiple) {
            if (current_value in this.exo_value_label_map) {
                updated_value = current_value;
            }
        } else {
            if (current_value) {
                let current_values = JSON.parse(current_value);
                let updated_values = [];
                current_values.forEach(value => {
                    if (value in this.exo_value_label_map) {
                        updated_values.push(value);
                    }
                });
                updated_value = JSON.stringify(updated_values);
            }
        }
        this.exoUpdate("value",updated_value);
    }

    exoClearOptions() {
        if (this.exoGetInputElement()) {
            ExoUtils.removeAllChildren(this.exoGetInputElement());
        }
        this.exo_value_label_map = {};
    }

    exoAddOption(value,label,disabled) {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(label));
        option.setAttribute("value", value);
        if (disabled) {
            option.setAttribute("disabled", "disabled");
        } else {
            this.exo_value_label_map[value] = label;
        }
        this.exoGetInputElement().appendChild(option);
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('options','multiple','value');
        return attrs;
    }

}

CustomExoSelect.INVALID_ERROR = "Invalid";

customElements.define("exo-select", CustomExoSelect);