/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class CustomExoToggle extends CustomExoControl {
    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);

        var element = this.exoGetInputElement();
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

        this.label = label;
        this.tt_span = null;
        this.ft_span = null;

        this.slider_span = span;

        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetInputElement().checked = (value == "true") ? true : false;
                this.exoSetControlValue(value);
                break;
            case "true-text":
                if (!this.tt_span) {
                    this.tt_span = document.createElement("span");
                    this.tt_span.setAttribute("class", "exo-toggle-true");
                    this.label.appendChild(this.tt_span);
                }
                ExoUtils.removeAllChildren(this.tt_span);
                if (value) {
                    this.tt_span.appendChild(document.createTextNode(value));
                }
                break;
            case "false-text":
                 if (!this.ft_span) {
                    this.ft_span = document.createElement("span");
                    this.ft_span.setAttribute("class", "exo-toggle-false");
                    this.label.appendChild(this.ft_span);
                }
                ExoUtils.removeAllChildren(this.ft_span);
                if (value) {
                    this.ft_span.appendChild(document.createTextNode(value));
                }
                break;
            case "fg-color":
                ExoUtils.removeClasses( this.slider_span, /(exo-)(.*)(-fg)/);
                ExoUtils.addClass(this.slider_span,"exo-"+value+"-fg");
                break;
            case "bg-color":
                ExoUtils.removeClasses(this.slider_span, /(exo-)(.*)(-bg)/);
                ExoUtils.addClass(this.slider_span,"exo-"+value+"-bg");
                break;
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
