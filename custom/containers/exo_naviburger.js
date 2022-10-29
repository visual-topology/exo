/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoContainer} from '../exo_container.js';
import {ExoUtils} from '../exo_utils.js';
import {CustomExoTab} from '../layouts/exo_tab.js';

class CustomExoNaviburger extends CustomExoContainer {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild("div",parameters);
        ExoUtils.addClass(this.exoGetElement(), "exo-menu");

        var cb = document.createElement("input");
        cb.setAttribute("aria-hidden","true");
        cb.setAttribute("type","checkbox");
        var cb_id = this.exoGetId()+"_cb";
        cb.setAttribute("id", cb_id);
        this.exoGetElement().appendChild(cb);
        var lbl_open = document.createElement("label");
        lbl_open.setAttribute("aria-hidden","true");
        lbl_open.setAttribute("for",cb_id);
        ExoUtils.addClasses(lbl_open,["exo-menu-open", "exo-button", "exo-icon", "exo-icon-medium", "exo-icon-menu"]);
        this.exoGetElement().appendChild(lbl_open);
        var lbl_close = document.createElement("label");
        lbl_close.setAttribute("aria-hidden","true");
        lbl_close.setAttribute("for",cb_id);
        ExoUtils.addClasses(lbl_close,["exo-menu-close", "exo-button", "exo-icon", "exo-icon-medium", "exo-icon-clear"]);
        this.exoGetElement().appendChild(lbl_close);

        var br = document.createElement("br");
        this.exoGetElement().appendChild(br);

        this.scan();
        this.appendChild(this.exoGetRootElement());
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
                var fg_color = node.getAttribute("fg-color");
                var bg_color = node.getAttribute("bg-color");

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
                ExoUtils.addClass(label, "exo-menu-item");

                label.appendChild(document.createTextNode(label_text));
                labels.push(label);
                if (fg_color) {
                    var fg_cls = "exo-"+fg_color+"-fg";
                    ExoUtils.addClass(input,fg_cls);
                    ExoUtils.addClass(label,fg_cls);
                }
                if (bg_color) {
                    var bg_cls = "exo-"+bg_color+"-bg";
                    ExoUtils.addClass(input, bg_cls);
                    ExoUtils.addClass(label,bg_cls);
                }
            }
        }

        for(var idx=0; idx<inputs.length; idx++) {
            this.exoGetElement().appendChild(inputs[idx]);
            this.exoGetElement().appendChild(labels[idx]);
        }

        var menu_div = document.createElement("div");
        ExoUtils.addClass(menu_div, "exo-menu-content");
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



customElements.define("exo-naviburger", CustomExoNaviburger);

