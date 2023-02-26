/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class CustomExoRadio extends CustomExoControl {
    constructor() {
        super();
        this.exo_button_count = 0;
        this.exo_button_map = {};
        this.exo_radio_name = "";
    }

    exoBuild(parameters) {
        super.exoBuildCommon("div", parameters);
        this.exo_radio_name = this.exoGetId()+"_rbg";
        this.appendChild(this.exoGetRootElement());
        super.exoBuildComplete(parameters);
    }

    exoUpdate(name, value) {
        switch (name) {
            case "value":
                this.exoSetControlValue(value);
                this.exoControlValueUpdated();
                break;
            case "options":
                var options = value.split(";");
                options.map(option => {
                    var delimiter = option.indexOf("=>");
                    if (delimiter > 0) {
                        var name = option.slice(0, delimiter);
                        var label = option.slice(delimiter + 2);
                        this.addRadioButton(name, label);
                    }
                });
                break;
            default:
                super.exoUpdate(name, value);
        }
    }

    exoControlValueUpdated() {
        var value = this.exoGetControlValue();
        var radios = document.getElementsByName(this.exo_radio_name);
        for(var idx=0; idx<radios.length; idx++) {
            if (radios[idx].value == value) {
                radios[idx].checked = true;
            }
        }
    }

    addRadioButton(value,label_text) {

        var btn_id = this.exoGetId()+"_b"+this.exo_button_count;
        this.exo_button_count += 1;

        var label = document.createElement("label");
        ExoUtils.addStyle(label,"display","inline-block");
        label.setAttribute("for",btn_id);
        var span = document.createElement("span");
        ExoUtils.addClass(span,"label-body");
        span.appendChild(document.createTextNode(label_text));
        label.appendChild(span);
        var input = document.createElement("input");
        input.setAttribute("id",btn_id);
        input.setAttribute("type","radio");
        input.setAttribute("name", this.exo_radio_name);
        input.setAttribute("value",value);

        this.exo_button_map[value] = input;

        this.exoGetInputElement().appendChild(label);
        this.exoGetInputElement().appendChild(input);

        input.addEventListener("input", evt => {
            this.exoSetControlValue(value);
            this.dispatchEvent(new CustomEvent("exo-value", {detail: value}));
            evt.stopPropagation();
        });
    }

    exoGetAttributeNames() {
        return CustomExoRadio.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('options','value');
        return attrs;
    }


}

customElements.define("exo-radio", CustomExoRadio);