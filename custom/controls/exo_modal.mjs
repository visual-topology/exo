/*
<div class="exo-modal">
    <input type="checkbox" id="modal1"/>
    <label for="modal1" class="exo-button">
            More Info
    </label>
    <div class="exo-modal-window">
        <div class="exo-modal-window-content exo-light-brown-bg">
            <div>
                    Lorem ipsum dolor
                    sit amet,
                    consectetur
                    adipiscing elit.
                    Aenean euismod, leo
                    sed imperdiet
                    ullamcorper, augue
                    lectus gravida
                    felis, quis
                    facilisis mi tortor
                    eu justo.
            </div>
            <label for="modal1">
                <span tabindex="-1" class="exo-modal-close"/>
            </label>
        </div>
    </div>
</div>
 */

/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {CustomExoControl} from '../exo_control.mjs';
import {ExoUtils} from '../exo_utils.mjs';

export {CustomExoModal};

class CustomExoModal extends CustomExoControl {

    constructor() {
        super();
        this.exo_button_text = null;
        this.exo_modal_cb = null;
        this.exo_modal_content_window = null;
    }

    exoBuild(parameters) {
        super.exoBuild("div", parameters);
        var root_ele = this.exoGetElement();

        var content_div = document.createElement("div");
        content_div.setAttribute("class","exo-modal-window-content");

        ExoUtils.moveChildNodes(this,content_div);

        ExoUtils.addClass(root_ele,"exo-modal");
        var cb = document.createElement("input");
        var cb_id = this.exoGetId()+"cb";
        cb.setAttribute("type","checkbox");
        cb.setAttribute("id", cb_id);
        root_ele.appendChild(cb);
        this.exo_modal_cb = cb;

        var window_div = document.createElement("div");
        window_div.setAttribute("class","exo-modal-window");
        root_ele.appendChild(window_div);
        this.exo_modal_content_window = window_div;

        window_div.appendChild(content_div);

        if (!parameters["no_close"]) {
            var close_label = document.createElement("label");
            close_label.setAttribute("for", cb_id);
            var close_span = document.createElement("span");
            close_span.setAttribute("tabindex", "-1");
            close_span.setAttribute("class", "exo-modal-close");
            close_label.appendChild(close_span);
            content_div.appendChild(close_label);
        }

        this.appendChild(this.exoGetRootElement());

        if ("splash-delay-ms" in parameters) {
            cb.checked = true;
            var splash_delay = Number.parseInt(parameters["splash-delay-ms"])
            window.setTimeout(function() {
                cb.checked = false;
            }, splash_delay);
        }

        this.exo_modal_cb.oninput = (evt) => {
            var v = this.exo_modal_cb.checked ? true : false;
            this.dispatchEvent(new CustomEvent("exo-value",{detail:v}));
            evt.stopPropagation();
        }
    }

    exoUpdate(name,value) {
        switch (name) {
            case "value":
                this.exoGetElement().checked = (value == "true") ? true : false;
                break;
            case "text":
                if (!this.exo_button_text) {
                    var label = document.createElement("label");
                    label.setAttribute("for", this.exo_modal_cb.getAttribute("id"));
                    label.setAttribute("class","exo-button");
                    label.appendChild(document.createTextNode(value));
                    this.exoGetElement().insertBefore(label, this.exo_modal_content_window);
                    this.exo_button_text = label;
                } else {
                    ExoUtils.removeAllChildren(this.exo_button_text);
                    this.exo_button_text.appendChild(document.createTextNode(value));
                }
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoModal.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push("text");
        return attrs;
    }
}

customElements.define("exo-modal", CustomExoModal);