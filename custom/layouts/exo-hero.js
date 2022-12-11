/* MIT License - Exo - Copyright (c) 2022 Visual Topology */


class CustomExoHero extends CustomExoElement {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild("div", parameters);
        ExoUtils.addClass(this.exoGetRootElement(),"exo-hero");
        ExoUtils.moveChildNodes(this,this.exoGetRootElement());
        this.appendChild(this.exoGetRootElement());
    }
}

customElements.define("exo-hero", CustomExoHero);