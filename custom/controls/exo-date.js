/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

class CustomExoDateTimeBase extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters,input_type) {
        super.exoBuild("input", parameters);

        this.exoGetElement().setAttribute("type",input_type);

        if ("min" in parameters) {
            this.exoGetElement().setAttribute("min", parameters["min"]);
        }
        if ("max" in parameters) {
            this.exoGetElement().setAttribute("max", parameters["max"]);
        }
        if ("value" in parameters) {
            this.exoGetElement().value = parameters["value"];
        } else {
            this.getExoElement().value = 0;
        }

        var that = this;

        this.exoGetElement().oninput = function (evt) {
            // var v = new Date(that.exoGetElement().value+"Z"); // UTC
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
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoDateTimeBase.observedAttributes;
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
        super.exoBuild(parameters, "date");
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


