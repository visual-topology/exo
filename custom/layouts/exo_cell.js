/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoElement} from '../exo_element.js';
import {ExoUtils} from '../exo_utils.js';

export {CustomExoCell};

class CustomExoCell extends CustomExoElement {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild("div", parameters);
        ExoUtils.addClass(this.exoGetRootElement(),"exo-cell");
        var width = this.getAttribute("cell-width") || "1";
        ExoUtils.addClass(this.exoGetRootElement(),"exo-"+width+"-cell");
        ExoUtils.moveChildNodes(this,this.exoGetRootElement());

        ExoUtils.replaceNode(this,this.exoGetRootElement());
        // this.appendChild(this.exoGetRootElement());
        // console.log("exo-cell build");
    }

    exoGetAttributeNames() {
        return CustomExoSelect.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoElement.observedAttributes;
        attrs.push('cell-width');
        return attrs;
    }
}

customElements.define("exo-cell", CustomExoCell);