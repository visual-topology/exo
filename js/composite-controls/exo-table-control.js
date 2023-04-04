
/*
    The value of this control is a data structure as below
    {
        "columns": [{
               "name": "col1"
               "label": "Column 1"
               "type": "string" | "boolean"
               "editable": true|false
            }],
        "rows": [
            {
               "col1": "aaa"
            }
        ]
    }
 */

class CustomExoTableControl extends CustomExoControl {

    constructor() {
        super();
        this.exo_tbl_elt = null;
        this.exo_table_definition = {};
        this.exo_column_names = [];
        this.exo_columns_by_name = {};
        const value_s = JSON.stringify(this.exo_table_definition);
        this.exoSetControlValue(value_s);
    }

    exoBuild(parameters) {
        super.exoBuildCommon("table", parameters);
        this.exo_tbl_elt = this.exoGetInputElement();
        ExoUtils.addClass(this.exo_tbl_elt,"exo-border");
        super.exoBuildComplete(parameters);
    }

    exoRefresh() {
        ExoUtils.removeAllChildren(this.exo_tbl_elt);
        this.exo_visible_column_names = [];
        if (this.exo_table_definition.columns) {
            let tr_elt = document.createElement("tr");
            this.exo_table_definition.columns.map((column_definition) => {
                let th_elt = document.createElement("th");
                th_elt.appendChild(document.createTextNode(column_definition.label));
                tr_elt.appendChild(th_elt);
                this.exo_column_names.push(column_definition.name);
                this.exo_columns_by_name[column_definition.name] = column_definition;
            });
            this.exo_tbl_elt.appendChild(tr_elt);
        }
        if (this.exo_table_definition.rows) {

            this.exo_table_definition.rows.map((row,row_index) => {
                let tr_elt = document.createElement("tr");
                this.exo_column_names.map((name) => {
                    let td_elt = document.createElement("td");
                    let col_def = this.exo_columns_by_name[name];
                    let value = row[name];
                    if (col_def.type == "boolean") {
                        let ctrl = document.createElement("exo-checkbox");
                        ctrl.setAttribute("value",""+value);
                        if (!col_def.editable) {
                            ctrl.setAttribute("disabled","true");
                        } else {
                            ctrl.addEventListener("change", (evt) => {
                                this.exoUpdateCell(name, row_index, evt.target.checked);
                            });
                        }
                        td_elt.appendChild(ctrl);
                    } else {
                        if (!col_def.editable) {
                            td_elt.appendChild(document.createTextNode("" + value));
                        } else {

                            let enable = document.createElement("exo-checkbox");


                            enable.setAttribute("class", "exo-inline");

                            td_elt.appendChild(enable);

                            let ctrl = document.createElement("exo-text");

                            ctrl.addEventListener("change", (evt) => {
                                this.exoUpdateCell(name, row_index, evt.target.value);
                            });

                            if (value == undefined) {
                                enable.setAttribute("value", "false");
                                value = "";
                                ctrl.setAttribute("visible","false");
                            } else {
                                enable.setAttribute("value", "true");
                            }

                            ctrl.setAttribute("value", value);

                            enable.addEventListener("change", (evt) => {
                                ctrl.setAttribute("visible", evt.target.checked ? "true" : "false");
                                if (!evt.target.checked) {
                                    this.exoUpdateCell(name, row_index, undefined);
                                } else {
                                    let v = ctrl.exoGetInputElement().value;
                                    this.exoUpdateCell(name, row_index, v);
                                }
                            });

                            td_elt.appendChild(ctrl);
                        }
                    }
                    tr_elt.appendChild(td_elt);
                });
                this.exo_tbl_elt.appendChild(tr_elt);
            });
        }
    }

    exoUpdateCell(column_name, row_index, new_value) {
        if (new_value !== undefined) {
            this.exo_table_definition.rows[row_index][column_name] = new_value;
        } else {
            delete this.exo_table_definition.rows[row_index][column_name];
        }
        const value_s = JSON.stringify(this.exo_table_definition);
        this.exoSetControlValue(value_s);
        this.dispatchEvent(new CustomEvent("exo-value", {detail: value_s}));
    }

    exoUpdate(name, value) {
        switch (name) {
            case "value":
                this.exo_table_definition = JSON.parse(value);
                this.exoRefresh();
                break;
            default:
                super.exoUpdate(name, value);
        }
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push('value');
        return attrs;
    }

}

customElements.define("exo-table-control", CustomExoTableControl);