/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class ExoPropertySheetElement {

    constructor(elt, parameters) {
        this.elt = elt;
        this.parameters = parameters;
        this.value = null;
        this.add_property_change_handler((value) => {
            this.value = value;
        })
    }

    set_property_value(value) {
        this.value = value;
        this.elt.value = value;
    }

    get_property_value() {
        return this.value;
    }

    add_property_change_handler(handler) {
        if (this.elt.addEventListener) {
            this.elt.addEventListener("input", (evt) => {
                handler(evt.target.value);
            });
        }
    }
}

class ExoPropertySheetSelect extends ExoPropertySheetElement {

    constructor(elt, parameters) {
        super(elt,parameters);
        this.multiple = this.elt.hasAttribute("multiple");
    }

    set_property_value(value) {
        this.value = value;
        if (this.multiple) {
            this.elt.setAttribute("value", JSON.stringify(value));
        } else {
            this.elt.setAttribute("value", value);
        }
    }

    add_property_change_handler(handler) {
        if (this.elt.addEventListener) {
            this.elt.addEventListener("change", (evt) => {
                if (this.multiple) {
                    handler(JSON.parse(this.elt.value));
                } else {
                    handler(this.elt.value);
                }
            });
        }
    }
}

class ExoPropertySheetRadio extends ExoPropertySheetElement {

    constructor(elt, parameters) {
        super(elt,parameters);
    }

    set_property_value(value) {
        this.value = value;
        this.elt.setAttribute("value", value);
    }

    add_property_change_handler(handler) {
        if (this.elt.addEventListener) {
            this.elt.addEventListener("change", (evt) => {
                handler(this.elt.value);
            });
        }
    }
}

class ExoPropertySheetText extends ExoPropertySheetElement {

    set_property_value(value) {
        this.value = value;
        this.elt.setAttribute("value", value);
    }

    add_property_change_handler(handler) {
        if (this.elt.addEventListener) {
            this.elt.addEventListener("change", (evt) => {
                handler(this.elt.value);
            });
        }
    }
}

class ExoPropertySheetNumber extends ExoPropertySheetElement {

    constructor(elt, parameters) {
        super(elt,parameters);
        this.is_integer = parameters ? (parameters.is_integer === true) : false;
    }

    set_property_value(value) {
        this.value = value;
        this.elt.setAttribute("value", String(value));
    }

    add_property_change_handler(handler) {
        if (this.elt.addEventListener) {
            this.elt.addEventListener("change", (evt) => {
                let v = Number.parseInt(this.elt.value);
                if (this.is_integer) {
                    v = Math.round(v);
                }
                handler(v);
            });
        }
    }
}

class ExoPropertySheetCheckbox extends ExoPropertySheetElement {

    set_property_value(value) {
        this.value = value;
        this.elt.setAttribute("value", value);
    }

    add_property_change_handler(handler) {
        if (this.elt.addEventListener) {
            this.elt.addEventListener("change", (evt) => {
                handler(this.elt.value);
            });
        }
    }
}

class ExoPropertySheetTable extends ExoPropertySheetElement {

    constructor(elt, parameters) {
        super(elt, parameters);
        this.single_column = parameters ? (parameters["single_column"] || false) : false;
    }

    set_property_value(value) {
        this.value = value;
        this.draw();
    }

    draw() {
        this.elt.innerHTML = "";
        for(let row=0; row<this.value.length; row+=1) {
            this.add_row(row,this.value[row])
        }
    }

    add_property_change_handler(handler) {
        if (this.property_change_handlers === undefined) {
            this.property_change_handlers = [];
        }
        this.property_change_handlers.push(handler);
    }

    add_row(row_index,values) {
        if (this.single_column) {
            values = [values];
        }
        let tr = document.createElement("tr");
        let td0 = document.createElement("td");
        let delete_btn = document.createElement("input");
        delete_btn.setAttribute("type", "button");
        delete_btn.setAttribute("value", "delete");
        delete_btn.addEventListener("click", () => {
            this.value = this.value.slice(0,row_index)
                .concat(this.value.slice(row_index+1));
            this.draw();
            if (this.property_change_handlers) {
                this.property_change_handlers.forEach((handler) => {
                    handler(this.value);
                });
            }
        });

        td0.appendChild(delete_btn);
        tr.appendChild(td0);
        for(let col=0; col<values.length; col++) {
            let td = document.createElement("td");
            td.appendChild(document.createTextNode(values[col]));
            tr.appendChild(td);
        }

        this.elt.appendChild(tr);
    }
}

function ExoPropertySheetElementFactory(element_id, parameters) {
    let elt = document.getElementById(element_id);
    switch(elt.tagName) {
        case "EXO-SELECT":
            return new ExoPropertySheetSelect(elt, parameters);
        case "EXO-RADIO":
            return new ExoPropertySheetRadio(elt, parameters);
        case "EXO-TEXTAREA":
        case "EXO-TEXT":
            return new ExoPropertySheetText(elt, parameters);
        case "EXO-NUMBER":
            return new ExoPropertySheetNumber(elt, parameters);
        case "EXO-CHECKBOX":
            return new ExoPropertySheetCheckbox(elt, parameters);
        case "TBODY":
            return new ExoPropertySheetTable(elt, parameters);
        default:
            return new ExoPropertySheetElement(elt, parameters);
    }
}

class ExoPropertySheetManager {

    constructor(property_change_listener, apply_btn_id, reset_btn_id) {
        this.property_change_listener = property_change_listener;
        this.apply_btn = apply_btn_id ? document.getElementById(apply_btn_id): null;
        this.reset_btn = reset_btn_id ? document.getElementById(reset_btn_id): null;
        this.elements = {};
        this.reset_properties = {};

        if (this.apply_btn) {
            this.apply_btn.addEventListener("click",(evt) => {
                this.apply();
            })
        }
        if (this.reset_btn) {
            this.reset_btn.addEventListener("click",(evt) => {
                this.reset();
            })
        }
        this.disable_apply_reset();
    }

    apply() {
        let updated_properties = this.get_properties();
        if (this.property_change_listener) {
            this.property_change_listener(updated_properties);
        }
        this.reset_properties = window.structuredClone(updated_properties);
        this.disable_apply_reset();
    }

    reset() {
        this.set_properties(this.reset_properties);
    }

    disable_apply_reset() {
        if (this.apply_btn) { this.apply_btn.setAttribute("disabled", "true"); }
        if (this.reset_btn) { this.reset_btn.setAttribute("disabled", "true"); }
    }

    enable_apply_reset() {
        if (this.apply_btn) { this.apply_btn.setAttribute("disabled", "false"); }
        if (this.reset_btn) { this.reset_btn.setAttribute("disabled", "false"); }
    }

    add_element(element_id, parameters) {
        let pse = ExoPropertySheetElementFactory(element_id, parameters);
        this.elements[element_id] = pse;
        pse.add_property_change_handler((value) => {
            if (this.apply_btn) {
                // note that the properties can be applied
                this.enable_apply_reset();
            } else {
                // if no apply button exists, update the properties immediately
                if (this.property_change_listener) {
                    this.property_change_listener(this.get_properties());
                }
            }
        });
        return this;
    }

    set_properties(properties) {
        this.reset_properties = window.structuredClone(properties);
        for(let element_id in properties) {
            if (element_id in this.elements) {
                this.elements[element_id].set_property_value(properties[element_id]);
            }
        }
        this.disable_apply_reset();
        return this;
    }

    get_properties() {
        let properties = {};
        for(let element_id in this.elements) {
            properties[element_id] = this.elements[element_id].get_property_value();
        }
        return properties;
    }

    get_property(element_id) {
        return this.elements[element_id].get_property_value();
    }

    update_property(element_id,value) {
        this.elements[element_id].set_property_value(value);
        this.enable_apply_reset();
    }

    add_property_change_handler(element_id, handler) {
        this.elements[element_id].add_property_change_handler(handler);
    }
}