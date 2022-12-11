/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

class CustomExoTab extends CustomExoElement {

    constructor() {
        super();
    }
    
     exoBuild(parameters) {
        super.exoBuild("div", parameters);
        ExoUtils.moveChildNodes(this,this.exoGetRootElement());
        this.appendChild(this.exoGetRootElement());
    }
}

customElements.define("exo-tab", CustomExoTab);