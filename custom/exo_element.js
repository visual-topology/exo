/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {ExoUtils} from './exo_utils.js';

export { CustomExoElement };

class CustomExoElement extends HTMLElement {

    constructor() {
        super();
        this.exo_built = false;
    }

    static exo_counter = 0;

    connectedCallback() {
        if (!this.exo_built) {
            this.exo_built = true;
            setTimeout(() => {
                this.exoBuild(this.exoGetParameters(this));
            }, 0);
        }
    }

    exoGetParameters() {
        let parameters = {};
        this.getAttributeNames().forEach(name => parameters[name] = this.getAttribute(name));
        return parameters;
    }

    exoBuild(tag, parameters) {
        this.exo_element = document.createElement(tag);
        if (parameters["id"]) {
            this.exo_id = parameters["id"];
        } else {
            this.exo_id = "exo"+CustomExoElement.exo_counter;
        }
        CustomExoElement.exo_counter += 1;
        this.exo_element.setAttribute("id",this.exo_id);

        if (parameters["fg-colour"]) {
            ExoUtils.addClass(this.exo_element,"exo-"+parameters["fg-colour"]+"-fg");
        }
        if (parameters["bg-colour"]) {
            ExoUtils.addClass(this.exo_element,"exo-"+parameters["bg-colour"]+"-bg");
        }

        if (parameters["full-width"]) {
            ExoUtils.addClass(this.exo_element,"exo-full-width");
        }

        var bg_image = this.getAttribute("bg-image");
        if (bg_image) {
            ExoUtils.addStyle(this.exoGetRootElement(),"background-image","url('"+bg_image+"');");
        }

        ["border","margin","padding","rounded","vmargin","hmargin"].forEach(
            name => { this.applySizedDimension(name,parameters[name]) }
        );

    }

    exoUpdate(name,value) {
        switch(name) {
            default:
                console.log("Unrecognized exoUpdate: "+name+","+value);
        }
    }

    exoGetElement() {
        return this.exo_element;
    }

    exoGetRootElement() {
        return this.exo_element;
    }

    exoGetId() {
        return this.exo_id;
    }

    exoUpdateLabelText(text) {
        this.label.innerHTML = "";
        this.label.appendChild(document.createTextNode(text?text:"\u00A0"));
    }

    static exoGetParameters(element) {
        return {
            "fg-colour":element.getAttribute("fg-colour"),
            "bg-colour":element.getAttribute("bg-colour")
        }
    }

    applySizedDimension(name,value) {
        if (value == undefined) {
            return;
        }
        if (value == "") {
            value = "medium";
        }
        if (value) {
            switch (value) {
                case "no":
                case "small":
                case "medium":
                case "large":
                    ExoUtils.addClass(this.exoGetRootElement(), "exo-" + value + "-" + name);
                    break;
                default:
                    console.log("Exo: Invalid " + name + " value: " + value + ", valid values are no,small,medium,large");
            }
        }
    }

    exoGetAttributeNames() {
        return CustomExoControl.observedAttributes();
    }

    static get observedAttributes() {
        return ["id", "fg-colour", "bg-colour", "border","margin","padding","rounded","vmargin","hmargin"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.exo_built) {
            this.exoUpdate(name, newValue);
        }
    }
}

