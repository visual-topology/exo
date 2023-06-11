/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class CustomExoDateTimeBase extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters,input_type) {
        super.exoBuildCommon("input", parameters);

        this.exoGetInputElement().setAttribute("type",input_type);

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetInputElement().value = value;
                this.exoSetControlValue(value);
                break;
            case "min":
                this.exoGetInputElement().setAttribute("min", value);
                break;
            case "max":
                this.exoGetInputElement().setAttribute("max", value);
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','min','max');
        return attrs;
    }
}

class CustomExoDate extends CustomExoDateTimeBase {

    constructor() {
        super();
    }

    exoBuild(parameters, type) {
        super.exoBuild(parameters,"date");
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','min','max');
        return attrs;
    }
}

class CustomExoTime extends CustomExoDateTimeBase {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild(parameters, "time");
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','min','max');
        return attrs;
    }
}

class CustomExoDateTimeLocal extends CustomExoDateTimeBase {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild(parameters, "datetime-local");
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value','min','max');
        return attrs;
    }
}

customElements.define("exo-date", CustomExoDate);
customElements.define("exo-time", CustomExoTime);
customElements.define("exo-datetime-local", CustomExoDateTimeLocal);


