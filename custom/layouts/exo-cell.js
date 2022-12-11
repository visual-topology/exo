/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

class CustomExoCell extends CustomExoElement {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild("div", parameters);
        ExoUtils.addClass(this.exoGetRootElement(),"exo-cell");
        ExoUtils.moveChildNodes(this,this.exoGetRootElement());
        ExoUtils.replaceNode(this,this.exoGetRootElement());
    }

    exoUpdate(name,value) {
        switch (name) {
            case "cell-width":
                ExoUtils.removeClasses(this.exoGetElement(), /exo-(.*)-cell/);
                ExoUtils.addClass(this.exoGetElement(), "exo-" + value + "-cell");
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoCell.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoElement.observedAttributes;
        attrs.push('cell-width');
        return attrs;
    }
}

customElements.define("exo-cell", CustomExoCell);