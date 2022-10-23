/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoControl} from '../exo_control.js';

/*
class ToggleControl {

    constructor(services, element, can_edit, parameters) {
        this.services = services;
        this.exo_element = element;
        this.can_edit = can_edit;
        if (!can_edit) {
            this.exo_element.disabled = true;
        }
        var label = document.createElement("label");
        label.setAttribute("class","exo-toggle");
        var parent = element.parentElement;
        parent.removeChild(element);
        var span = document.createElement("span");
        span.setAttribute("class","exo-toggle-slide");
        label.appendChild(element);
        span.appendChild(document.createTextNode(""));
        label.appendChild(span);
        parent.appendChild(label);

        if (parameters.true_text) {
            var tt_span = document.createElement("span");
            tt_span.setAttribute("class","exo-toggle-true");
            tt_span.appendChild(document.createTextNode(parameters.true_text));
            label.appendChild(tt_span);
        }
        if (parameters.false_text) {
            var ft_span = document.createElement("span");
            ft_span.setAttribute("class","exo-toggle-false");
            ft_span.appendChild(document.createTextNode(parameters.false_text));
            label.appendChild(ft_span);
        }

        var that = this;

        this.exo_element.oninput = function () {
            var v;
            if (that.element.checked) {
                v = true;
            } else {
                v = false;
            }
            if (that.can_edit) {
                that.services.send({"value": v});
            }
        }
    }

    recv(msg) {
        if ("value" in msg) {
            var v = msg["value"];
            this.exo_element.checked = v;
        }
    }

} */

/* MIT License - Exo - Copyright (c) 2022 Visual Topology */


class CustomExoToggle extends CustomExoControl {
    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild("input", parameters);

        var element = this.exoGetElement();
        element.setAttribute("type","checkbox");

        var label = document.createElement("label");
        label.setAttribute("class","exo-toggle");
        var parent = element.parentElement;
        parent.removeChild(element);
        var span = document.createElement("span");
        span.setAttribute("class","exo-toggle-slide");
        label.appendChild(element);
        span.appendChild(document.createTextNode(""));
        label.appendChild(span);
        parent.appendChild(label);

        if (parameters.true_text) {
            var tt_span = document.createElement("span");
            tt_span.setAttribute("class","exo-toggle-true");
            tt_span.appendChild(document.createTextNode(parameters.true_text));
            label.appendChild(tt_span);
        }
        if (parameters.false_text) {
            var ft_span = document.createElement("span");
            ft_span.setAttribute("class","exo-toggle-false");
            ft_span.appendChild(document.createTextNode(parameters.false_text));
            label.appendChild(ft_span);
        }

        var that = this;

        this.exoGetElement().oninput = function (evt) {
            var v = that.exoGetElement().checked ? true : false;
            that.dispatchEvent(new CustomEvent("exo-value",{detail:v}));
            evt.stopPropagation();
        }
        this.appendChild(this.exoGetRootElement());
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetElement().checked = value;
                break;
            case "true-text":
                break; // TODO
            case "false-text":
                break; // TODO
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoToggle.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value');
        attrs.push('true_text');
        attrs.push('false_text');
        return attrs;
    }
}

customElements.define("exo-toggle", CustomExoToggle);
