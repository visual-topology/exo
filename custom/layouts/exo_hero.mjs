/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoElement} from '../exo_element.mjs';
import {ExoUtils} from '../exo_utils.mjs';

export {CustomExoHero};

class CustomExoHero extends CustomExoElement {

    constructor() {
        super();
        this.exo_connections = 0;
    }

    exoBuild(parameters) {
        super.exoBuild("div", parameters);
        ExoUtils.addClass(this.exoGetRootElement(),"exo-hero");
        ExoUtils.moveChildNodes(this,this.exoGetRootElement());
        this.appendChild(this.exoGetRootElement());
    }
}

customElements.define("exo-hero", CustomExoHero);