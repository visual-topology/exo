/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoElement} from '../exo_element.js';
import {ExoUtils} from '../exo_utils.js';

export {CustomExoTab};

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