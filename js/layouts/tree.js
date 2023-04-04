/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class ExoTree extends HTMLDivElement {
    constructor() {
      super();
      this.connected = false;
    }

    connectedCallback() {
        if (this.connected) {
            return;
        }
        this.connected = true;
        let p_elt = this.parentElement;
        if (p_elt.exo_ul == undefined) {

            // p_elt.exo_ul = ExoUtils.createElement("ul",{"class":"exo-tree"});
            p_elt.exo_ul = ExoUtils.createElement("ul",{});
            p_elt.appendChild(p_elt.exo_ul);
        }
        let li = ExoUtils.createElement("li",{"role":"treeitem"});
        let inp = ExoUtils.createElement("input",{"type":"checkbox","aria-hidden":"true"});
        this.label = ExoUtils.createElement("label");
        this.label.appendChild(document.createTextNode(this.getAttribute("label")));
        li.appendChild(inp);
        li.appendChild(this.label);
        p_elt.exo_ul.appendChild(li);
        li.appendChild(this);
        this.set
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "label" && this.label) {
            ExoUtils.removeAllChildren(this.label);
            this.label.appendChild(document.createTextNode(newValue));
        }
    }

    static get observedAttributes() {
        return ["label"];
    }
}

customElements.define(
  "exo-tree",
  ExoTree,
    {"extends":"div"}
);

