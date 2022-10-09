/* MIT License

 Copyright (c) 2022 Visual Topology

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/

class ExoWidget {

    constructor(tag, parameters) {
        this.event_handlers = {};
        this.element = document.createElement(tag);
        var classes = [];

        if (parameters["fg_colour"]) {
            classes.push("exo-"+parameters["fg_colour"]+"-fg");
        }
        if (parameters["bg_colour"]) {
            classes.push("exo-"+parameters["bg_colour"]+"-bg");
        }
        if (parameters["style"]) {
            for (var idx = 0; idx < parameters["style"].length; idx++) {
                classes.push(parameters["style"][idx]);
            }
        }
        if (parameters["full_width"]) {
            classes.push("exo-full-width");
        }
        var cls = this.element.getAttribute("class");
        if (cls) {
            cls = cls + " " + classes.join(" ");
        } else {
            cls = classes.join(" ");
        }

        this.element.setAttribute("class",cls);
        this.root_element = document.createElement("div")

        if (parameters.label) {
            this.label = document.createElement("label");
            this.label.setAttribute("for", this.widget_id);
            this.label.setAttribute("style", "display:inline; margin-right:5px;");
            this.root_element.appendChild(this.label);
            this.updateLabelText(parameters.label);
            this.root_element.appendChild(document.createElement("br"));
        }
        this.root_element.appendChild(this.element);
    }

    update(name,value) {
        switch(name) {
            case "label":
                this.updateLabelText(value);
                break;
            default:
                console.error("Unrecognized update: "+name+","+value);
        }
    }

    setEditable(can_edit) {
        this.getElement().disabled = !can_edit;
    }

    getWidgetId() {
        return this.widget_id;
    }

    getElement() {
        return this.element;
    }

    getRootElement() {
        return this.root_element;
    }

    addEventListener(event_type, handler) {
        if (this.event_handlers[event_type] == undefined) {
            this.event_handlers[event_type] = [];
        }
        this.event_handlers[event_type].push(handler);
    }

    removeEventListener(event_type, handler) {
        if (this.event_handlers[event_type]) {
            this.event_handlers[event_type].filter(h => handler != h);
        }
    }

    fireEvent(event_type, event_value) {
        if (this.event_handlers[event_type]) {
            this.event_handlers[event_type].forEach(listener => listener(event_value));
        }
    }

    updateLabelText(text) {
        this.label.innerHTML = "";
        this.label.appendChild(document.createTextNode(text?text:"\u00A0"));
    }
}