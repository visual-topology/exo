/*
<input aria-hidden="true" type="checkbox" id="nm1">
            <label aria-hidden="true" class="exo-tabs-open exo-button exo-icon exo-icon-medium exo-icon-menu" for="nm1">
            </label>
            <label aria-hidden="true" class="exo-tabs-close exo-button exo-rounded exo-icon exo-icon-medium exo-icon-clear" for="nm1">
            </label>
            <br>

            <input aria-hidden="true" type="radio" name="g2" id="ncontent-a1" checked="">
            <label aria-hidden="true" class="exo-tabs-item exo-white-bg" for="ncontent-a1" tabindex="-1">Tab 1</label>
 */
class ExoTab extends HTMLElement {
    constructor() {
      super();
      this.connected = false;
    }

    connectedCallback() {
        if (this.connected) {
            return;
        }
        this.connected = true;
        let p_elt = this.parentElement;
        if (p_elt.exo_tab_count == undefined) {
            p_elt.exo_tab_count = 0;
            p_elt.exo_tabs = [];
        }
        let parent_id = p_elt.getAttribute("id");
        let group_id = parent_id+"-tab-group";
        let tab_content_id = parent_id+"-tab-content";
        let cb_id = parent_id+"-cb";
        let first = false;
        let content_elt = null;
        if (p_elt.exo_tab_count == 0) {

            let cb_elt = ExoUtils.createElement("input",{"aria-hidden":"true", "type":"checkbox", "id":cb_id});
            let cb_label_open = ExoUtils.createElement("label",{
                "aria-hidden":"true",
                "class":"exo-tabs-open exo-button exo-icon exo-icon-medium exo-icon-menu",
                "for":cb_id});
            let cb_label_close = ExoUtils.createElement("label",{
                "aria-hidden":"true",
                "class":"exo-tabs-close exo-button exo-rounded exo-icon exo-icon-medium exo-icon-clear",
                "for":cb_id});

            let break_elt = document.createElement("br");
            content_elt = document.createElement("div");
            content_elt.setAttribute("class","exo-tabs-content");
            content_elt.setAttribute("id", tab_content_id);
            p_elt.insertBefore(content_elt,p_elt.firstElementChild);
            p_elt.insertBefore(break_elt,p_elt.firstElementChild);
            p_elt.insertBefore(cb_label_close,p_elt.firstElementChild);
            p_elt.insertBefore(cb_label_open,p_elt.firstElementChild);
            p_elt.insertBefore(cb_elt,p_elt.firstElementChild);
            first = true;
        } else {
            content_elt = document.getElementById(tab_content_id);
        }
        let content_id = parent_id + "-tab-"+p_elt.exo_tab_count;

        this.label = ExoUtils.createElement("label",{
            "for":content_id,
            "aria-hidden":"true",
            "class":"exo-tabs-item exo-white-bg"});
        this.label.appendChild(document.createTextNode(this.getAttribute("label")));

        let input = ExoUtils.createElement("input", {
            "type":"radio","name":group_id,"id":content_id
        });
        if (first) {
            input.setAttribute("checked","checked");
        }
        p_elt.insertBefore(input, content_elt);
        p_elt.insertBefore(this.label, content_elt);
        p_elt.exo_tabs.push(this);
        p_elt.exo_tab_count += 1;
        document.getElementById(tab_content_id).appendChild(this);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "label" && this.label) {
            ExoUtils.removeAllChildren(this.label);
            this.label.appendChild(document.createTextNode(newValue));
        }
    }

    static get observedAttributes() {
        return ["label"];
    }
}

customElements.define(
  "exo-tab",
  ExoTab
);