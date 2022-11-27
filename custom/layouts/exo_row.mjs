/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoElement} from '../exo_element.mjs';
import {ExoUtils} from '../exo_utils.mjs';

export {CustomExoRow};

class CustomExoRow extends CustomExoElement {

    constructor() {
        super();
        this.built = false;
    }


     exoBuild(parameters) {
        if (this.built) {
            return;
        }
        this.built = true;
        super.exoBuild("div", parameters);

        ExoUtils.addClass(this.exoGetRootElement(),"exo-row");
        ExoUtils.moveChildNodes(this,this.exoGetRootElement());
        ExoUtils.replaceNode(this,this.exoGetRootElement());
    }
}

customElements.define("exo-row", CustomExoRow);