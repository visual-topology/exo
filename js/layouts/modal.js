/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

var exo_modal_counter = 0;

class ExoModal extends HTMLDivElement {
    constructor() {
      super();
      this.connected = false;
    }

    connectedCallback() {
        if (this.connected) {
            return;
        }
        this.connected = true;
        this.modal_id = "exo_modal_id"+exo_modal_counter;
        exo_modal_counter += 1;
        this.setAttribute("class","exo-modal-window-content");
        var w = ExoUtils.createElement("div",{"class":"exo-modal-window"});
        var m = ExoUtils.createElement("div", {"class":"exo-modal"});
        this.checkbox = ExoUtils.createElement("input",{"type":"checkbox","id":this.modal_id});
        if (this.hasAttribute("display")) {
            this.checkbox.checked = (this.getAttribute("display") == "true") ? true : false;
        }
        this.label = ExoUtils.createElement("label",{"for":this.modal_id, "style":"display:none;"});
        this.open_button = ExoUtils.createElement("label",{"class":"exo-button","for":this.modal_id, "style":"display:none;"});
        m.appendChild(this.label);
        m.appendChild(this.checkbox);
        m.appendChild(this.open_button);
        m.appendChild(w);
        var cl = ExoUtils.createElement("label",{"for":this.modal_id});
        this.close_button = ExoUtils.createElement("span",{"tabindex":"-1","class":"exo-icon exo-modal-close"});
        cl.appendChild(this.close_button);
        let p_elt = this.parentElement;
        w.appendChild(this);
        this.appendChild(cl);
        p_elt.appendChild(m);

        ExoModal.observedAttributes.map((attr) => {
            if (this.hasAttribute(attr)) {
                this.attributeChangedCallback(attr,null,this.getAttribute(attr));
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.close_button) {
            switch(name) {
                case "button-text":
                    ExoUtils.removeAllChildren(this.open_button);
                    this.open_button.appendChild(document.createTextNode(newValue));
                    if (newValue) {
                        this.open_button.setAttribute("style","display:inline;");
                    } else {
                        this.open_button.setAttribute("style","display:none;");
                    }
                    break;
                case "button-label":
                    ExoUtils.removeAllChildren(this.label);
                    this.label.appendChild(document.createTextNode(newValue));
                    if (newValue) {
                        this.label.setAttribute("style","display:block;");
                    } else {
                        this.label.setAttribute("style","display:none;");
                    }
                    break;
                case "button-fg-color":
                   ExoUtils.applyColor(this.open_button,"fg",newValue);
                    break;
                case "button-bg-color":
                    ExoUtils.applyColor(this.open_button,"bg",newValue);
                    break;
                case "fg-color":
                   ExoUtils.applyColor(this,"fg",newValue);
                    break;
                case "bg-color":
                    ExoUtils.applyColor(this,"bg",newValue);
                    break;
                case "close-button-color":
                    ExoUtils.addClass(this.close_button,"exo-"+newValue);
                    break;
                case "border-color":
                    ExoUtils.applyColor(this, "border", newValue);
                    ExoUtils.addClass(this,"exo-border");
                    break;
                case "display":
                    this.checkbox.checked = (newValue == "true") ? true : false;
                    break;
                case "border":
                case "rounded":
                    ExoUtils.applySizedDimension(this,name,newValue);
                    break;
                case "width":
                    ExoUtils.addStyle(this,"width",newValue);
                    break;
                case "height":
                    ExoUtils.addStyle(this,"max-height",newValue);
                    break;
            }
        }
    }

    static get observedAttributes() {
        return ["button-text", "button-label", "button-fg-color", "button-bg-color", "fg-color", "bg-color", "close-button-color",
            "display", "border-color", "border", "margin", "rounded", "padding", "width", "height"];
    }
}

customElements.define(
  "exo-modal",
  ExoModal,
    {"extends":"div"}
);

