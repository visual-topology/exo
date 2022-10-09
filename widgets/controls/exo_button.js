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

class ExoButtonControl extends ExoWidget {

    constructor(parameters) {
        super(parameters["text"] ? "input" : "button", parameters);
        if (parameters["text"]) {
            this.getElement().setAttribute("type","button");
            this.getElement().setAttribute("value", parameters["text"]);
        } else {
            this.getElement().setAttribute("class", "exo-icon " + parameters["icon"]);
        }

        var that = this;
        this.getElement().onclick = function () {
            that.fireEvent("click",null);
        }
    }

    update(name,value) {
        switch(name) {
            case "text":
                this.getElement().setAttribute("value", value);
                break;
            default:
                super.update(name,value);
        }
    }
}

class CustomExoButtonControl extends HTMLElement {
    constructor() {
        super();
        this.control = null;
    }

    connectedCallback() {
        this.control = new ExoButtonControl({
            "text":this.getAttribute("text"),
            "label":this.getAttribute("label"),
            "fg_colour":this.getAttribute("fg_colour"),
            "bg_colour":this.getAttribute("bg_colour")
        });
        this.append(this.control.getRootElement());
    }

    getControl() {
        return this.control;
    }

    static get observedAttributes() { return ['text', 'label', 'tooltip', 'fg_colour', 'bg_colour']; }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.control) {
            this.control.update(name, newValue);
        }
    }

}

customElements.define("exo-button", CustomExoButtonControl);

function createButtonControl(services, element, can_edit, parameters) {
    var bc = new ExoButtonControl(parameters);
    bc.setEditable(can_edit);
    element.parentNode.replaceChild(bc.getRootElement(),element);
    bc.addEventListener("click", () => services.send({}));
    return bc;
}