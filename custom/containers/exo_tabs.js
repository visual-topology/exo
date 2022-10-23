/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoContainer} from '../exo_container.js';
import {ExoUtils} from '../exo_utils.js';
import {CustomExoTab} from '../layouts/exo_tab.js';

class CustomExoTabs extends CustomExoContainer {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild("div",parameters);
        ExoUtils.addClass(this.exoGetElement(), "exo-tabs");
        this.scan();
        this.appendChild(this.exoGetRootElement());
    }

    connectedCallback() {
        var parameters = CustomExoTabs.exoGetParameters(this);
        setTimeout(() => {
            this.exoBuild(parameters);
            },0);
    }

    scan() {
        var exo_tabs = [];
        var inputs = [];
        var labels = [];
        var radio_name = this.exoGetId()+"_radio";
        for(var idx=0; idx<this.childNodes.length; idx++) {
            var node = this.childNodes[idx];
            if (node.nodeType == Node.ELEMENT_NODE && node.tagName == "EXO-TAB") {
                exo_tabs.push(node);
                var label_text = node.getAttribute("tab-label");
                var fg_colour = node.getAttribute("fg-colour");
                var bg_colour = node.getAttribute("bg-colour");

                var input = document.createElement("input");
                var radio_id = radio_name+idx;
                ExoUtils.setAttributes(
                    input,
                    [["aria-hidden","true"],["type","radio"],["name",radio_name],["checked","checked"], ["id",radio_id]]);
                inputs.push(input)
                var label = document.createElement("label");
                ExoUtils.setAttributes(
                    label,
                    [["aria-hidden","true"],["for",radio_id]]);
                label.appendChild(document.createTextNode(label_text));
                labels.push(label);
                if (fg_colour) {
                    var fg_cls = "exo-"+fg_colour+"-fg";
                    ExoUtils.addClass(input,fg_cls);
                    ExoUtils.addClass(label,fg_cls);
                }
                if (bg_colour) {
                    var bg_cls = "exo-"+bg_colour+"-bg";
                    ExoUtils.addClass(label,bg_cls);
                }
            }
        }

        for(var idx=0; idx<inputs.length; idx++) {
            this.exoGetElement().appendChild(labels[idx]);
            this.exoGetElement().appendChild(inputs[idx]);
        }

        var menu_div = document.createElement("div");

        var break_div = document.createElement("div");
        ExoUtils.addClass(break_div, "exo-break");
        this.exoGetElement().appendChild(break_div);
        ExoUtils.addClass(menu_div, "exo-tabs-content");

        this.exoGetElement().appendChild(menu_div);
        exo_tabs.forEach(exo_tab => {
            exo_tab.parentNode.removeChild(exo_tab);
            menu_div.appendChild(exo_tab);
        });

    }

    exoUpdate(name,value) {
    }

    static get observedAttributes() {
       var attrs = CustomExoContainer.observedAttributes;
       return attrs;
    }

}


customElements.define("exo-tabs", CustomExoTabs);
