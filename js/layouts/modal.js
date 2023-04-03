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
        var i = ExoUtils.createElement("input",{"type":"checkbox","id":this.modal_id});
        var l = ExoUtils.createElement("label",{"class":"exo-button","for":this.modal_id});
        m.appendChild(i);
        m.appendChild(l);
        m.appendChild(w);
        var cl = ExoUtils.createElement("label",{"for":this.modal_id});
        this.close_button = ExoUtils.createElement("span",{"tabindex":"-1","class":"exo-icon exo-modal-close"});
        cl.appendChild(this.close_button);
        let p_elt = this.parentElement;
        w.appendChild(this);
        this.appendChild(cl);
        p_elt.appendChild(m);
        this.label = l;

        ExoModal.observedAttributes.map((attr) => {
            if (this.hasAttribute(attr)) {
                this.attributeChangedCallback(attr,null,this.getAttribute(attr));
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.label) {
            switch(name) {
                case "button-text":
                    ExoUtils.removeAllChildren(this.label);
                    this.label.appendChild(document.createTextNode(newValue));
                    break;
                case "button-fg-color":
                    ExoUtils.removeClasses( this.label, /exo-(.*)-fg/);
                    ExoUtils.addClass(this.label,"exo-"+newValue+"-fg");
                    break;
                case "button-bg-color":
                    ExoUtils.removeClasses( this.label, /exo-(.*)-bg/);
                    ExoUtils.addClass(this.label,"exo-"+newValue+"-bg");
                    break;
                case "fg-color":
                    ExoUtils.removeClasses( this, /exo-(.*)-fg/);
                    ExoUtils.addClass(this,"exo-"+newValue+"-fg");
                    break;
                case "bg-color":
                    ExoUtils.removeClasses( this, /exo-(.*)-bg/);
                    ExoUtils.addClass(this,"exo-"+newValue+"-bg");
                    break;
                case "close-button-color":
                    ExoUtils.addClass(this.close_button,"exo-"+newValue);
                    break;

            }
        }
    }

    static get observedAttributes() {
        return ["button-text", "button-fg-color", "button-bg-color", "fg-color", "bg-color", "close-button-color"];
    }
}

customElements.define(
  "exo-modal",
  ExoModal,
    {"extends":"div"}
);

