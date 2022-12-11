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

        this.label = label;
        this.tt_span = null;
        this.ft_span = null;

        var that = this;

        this.exoGetElement().oninput = function (evt) {
            var v = that.exoGetElement().checked ? true : false;
            that.dispatchEvent(new CustomEvent("exo-value",{detail:v}));
            evt.stopPropagation();
        }
        this.appendChild(this.exoGetRootElement());

        this.slider_span = span;
    }

    exoUpdate(name,value) {
        switch(name) {
            case "value":
                this.exoGetElement().checked = value;
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
