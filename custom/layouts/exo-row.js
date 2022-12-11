/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

class CustomExoRow extends CustomExoElement {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild("div", parameters);
        ExoUtils.addClass(this.exoGetRootElement(),"exo-row");
        ExoUtils.moveChildNodes(this,this.exoGetRootElement());
        ExoUtils.replaceNode(this,this.exoGetRootElement());
    }
}

customElements.define("exo-row", CustomExoRow);