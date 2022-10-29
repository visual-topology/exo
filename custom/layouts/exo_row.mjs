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
        for(var idx=0; idx<this.childNodes.length; idx++) {
            console.log("exo-row-child:"+this.childNodes[idx].tagName);
        }

        ExoUtils.addClass(this.exoGetRootElement(),"exo-row");
        ExoUtils.moveChildNodes(this,this.exoGetRootElement());
        ExoUtils.replaceNode(this,this.exoGetRootElement());
        // this.appendChild(this.exoGetRootElement());
    }
}

customElements.define("exo-row", CustomExoRow);