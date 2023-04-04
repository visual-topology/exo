
class CustomExoMergeLists extends CustomExoControl {

    constructor() {
        super();
        this.merged = [];
        this.exo_key_map = {};
        this.options1 = null;
        this.options2 = null;
        this.addb = null;
        this.subb = null;
        this.sel1 = null;
        this.sel2 = null;
        this.sel3 = null;
        const value_s = JSON.stringify(this.merged);
        this.exoSetControlValue(value_s);
    }

    exoBuild(parameters) {
        super.exoBuildCommon("div", parameters);

        let r = document.createElement("div");
        r.setAttribute("class","exo-row");
        let cell1 = document.createElement("div");
        cell1.setAttribute("class","exo-cell");
        this.sel1 = document.createElement("exo-select");
        this.sel2 = document.createElement("exo-select");

        this.sel1.addEventListener("change", (evt) => this.exoUpdateButtons());
        this.sel2.addEventListener("change", (evt) => this.exoUpdateButtons());

        let cell2 = document.createElement("div");
        cell2.setAttribute("class","exo-cell exo-cell-centered");
        this.addb = document.createElement("exo-button");
        this.addb.setAttribute("icon","arrow-right");
        this.addb.setAttribute("disabled","true");
        this.addb.setAttribute("aria-label","Add Combination");
        this.addb.addEventListener("click", (evt) => {
            const v1 = this.sel1.value;
            const v2 = this.sel2.value;
            if (v1 && v2) {
                this.sel1.exoSetControlValue(null);
                this.sel2.exoSetControlValue(null);
                this.exoAddMerge(v1, v2);
                this.exoUpdateMerged();
                this.exoUpdateButtons();
                this.exoDispatch();
            }
        });
        this.subb = document.createElement("exo-button");
        this.subb.setAttribute("icon","arrow-left");
        this.subb.setAttribute("disabled","true");
        this.subb.setAttribute("aria-label","Remove Combination");
        this.subb.addEventListener("click", (evt) => {
            const k = this.sel3.value;
            const v = this.exo_key_map[k];
            this.exoRemoveMerge(v[0],v[1]);
            delete this.exo_key_map[k];
            this.exoUpdateMerged();
            this.exoUpdateButtons();
            this.exoDispatch();
        });
        cell2.appendChild(this.addb);
        cell2.appendChild(this.subb);

        let cell3 = document.createElement("div");
        cell3.setAttribute("class","exo-cell");
        this.sel3 = document.createElement("exo-select");
        this.sel3.addEventListener("change", (evt) => this.exoUpdateButtons());
        cell3.appendChild(this.sel3);

        r.appendChild(cell1);
        r.appendChild(cell2);
        r.appendChild(cell3);
        cell1.appendChild(this.sel1);
        cell1.appendChild(this.sel2);
        this.exoGetInputElement().appendChild(r);
        super.exoBuildComplete(parameters);
    }

    exoAddMerge(v1,v2) {
        for(let idx=0; idx<this.merged.length; idx++) {
            if (this.merged[idx][0] == v1 && this.merged[idx][1] == v2) {
                return;
            }
        }
        this.merged.push([v1,v2]);
    }

    exoRemoveMerge(v1,v2) {
        this.merged = this.merged.filter((item) => item[0] != v1 || item[1] != v2);
    }

    exoUpdateMerged() {
        this.sel3.exoClearOptions();
        const options = [];
        this.exo_key_map = {};
        for (let idx = 0; idx < this.merged.length; idx++) {
            let v1 = this.merged[idx][0];
            let v2 = this.merged[idx][1];
            let key = v1 + "+" + v2;
            let label = this.options1[v1] + "+" + this.options2[v2];
            this.exo_key_map[key] = [v1, v2];
            options.push([key, label]);
        }
        const options_s = JSON.stringify(options);
        const value_s = JSON.stringify(this.merged);
        this.sel3.setAttribute("options", options_s);
        this.exoSetControlValue(value_s);
    }

    exoUpdateButtons() {
        if (this.sel3.value) {
            this.subb.setAttribute("disabled","false");
        } else {
            this.subb.setAttribute("disabled","true");
        }
        if (this.sel1.value && this.sel2.value) {
            this.addb.setAttribute("disabled","false");
        } else {
            this.addb.setAttribute("disabled","true");
        }
    }

    exoDispatch() {
        const value_s = JSON.stringify(this.merged);
        this.dispatchEvent(new CustomEvent("exo-value", {detail: value_s}));
    }

    exoUpdate(name, value) {
        switch (name) {
            case "value":
                this.merged = JSON.parse(value);
                if (this.options1  && this.options2) {
                    this.exoUpdateMerged();
                }
                break;
            case "options1":
                this.sel1.setAttribute("options",value);
                this.options1 = {};
                JSON.parse(value).map((item) => this.options1[item[0]] = item[1]);
                if (this.options2) {
                    this.exoUpdateMerged();
                }
                break;
            case "options2":
                this.sel2.setAttribute("options",value);
                this.options2 = {};
                JSON.parse(value).map((item) => this.options2[item[0]] = item[1]);
                if (this.options1) {
                    this.exoUpdateMerged();
                }
                break;
            case "size":
                this.sel1.setAttribute("size",value);
                this.sel2.setAttribute("size",value);
                this.sel3.setAttribute("size",""+2*Number.parseInt(value));
                break;
            default:
                super.exoUpdate(name, value);
        }
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('options1','options2','value');
        return attrs;
    }


}

customElements.define("exo-merge-lists", CustomExoMergeLists);