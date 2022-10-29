/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

import {ExoUtils} from './exo_utils.mjs';

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
                let parameters = this.exoGetParameters(this);
                this.exoBuild(parameters);
                this.exoUpdateParameters(parameters);
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



        /*





        */


    }

    exoUpdateParameters(parameters) {
        for(var name in parameters) {
            if (name != "id") {
                this.exoUpdate(name, parameters[name]);
            }
        }
    }

    exoUpdate(name,value) {
        switch(name) {
            case "fg-color":
                ExoUtils.removeClasses( this.exoGetElement(), /exo-(.*)-fg/);
                ExoUtils.addClass(this.exo_element,"exo-"+value+"-fg");
                break;
            case "bg-color":
                ExoUtils.removeClasses(this.exoGetElement(), /exo-(.*)-bg/);
                ExoUtils.addClass(this.exo_element,"exo-"+value+"-bg");
                break;
            case "border":
            case "margin":
            case "padding":
            case "rounded":
            case "vmargin":
            case "hmargin":
                this.applySizedDimension(name,value);
                break;
            case "bg-image":
                if (value) {
                    ExoUtils.addStyle(this.exoGetElement(),"background-image","url('"+value+"');");
                }
                break;
            case "full-width":
                ExoUtils.addClass(this.exoGetElement(),"exo-full-width");
                break;
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
            "fg-color":element.getAttribute("fg-color"),
            "bg-color":element.getAttribute("bg-color")
        }
    }

    applySizedDimension(name,value) {
        if (value == undefined) {
            return;
        }
        if (value == "") {
            value = "medium";
        }
        ExoUtils.removeClasses(this.exoGetElement(), new RegExp("(exo-)(.*)(-"+name+")"));
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
        return ["id", "fg-color", "bg-color", "border","margin","padding","rounded","vmargin","hmargin"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.exo_built) {
            this.exoUpdate(name, newValue);
        }
    }
}

