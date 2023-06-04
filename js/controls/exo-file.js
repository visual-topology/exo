/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class CustomExoFile extends CustomExoControl {

    constructor() {
        super();
        this.filename_span = null;
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);
        this.exoGetInputElement().setAttribute("type","file");
        this.exoGetInputElement().setAttribute("id","file_test");

        ExoUtils.addStyle(this.exoGetInputElement(),"display","none");
        this.label = document.createElement("label");
        this.label.setAttribute("class","exo-button");
        this.label.setAttribute("for","file_test");

        this.filename_span = document.createElement("span");
        this.filename_span.setAttribute("style","margin-left:10px;")
        this.filename_span.appendChild(document.createTextNode("filename.txt"));

        this.exoGetRootElement().appendChild(this.label);
        this.exoGetRootElement().appendChild(this.filename_span);

        var that = this;

        this.exoGetInputElement().oninput = function (evt) {
            const filelist = that.exoGetInputElement().files;
            var files = {};
            for(var idx=0; idx<filelist.length;idx++) {
                var file = filelist[idx];
                files[file.name] = file;
                ExoUtils.removeAllChildren(that.filename_span);
                that.filename_span.appendChild(document.createTextNode(file.name));
            }
            that.dispatchEvent(new CustomEvent("exo-file-changed",{detail:files}));
        }
        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            case "button-text":
                 ExoUtils.removeAllChildren(this.label);
                 this.label.appendChild(document.createTextNode(value));
                 break;
            case "filename":
                ExoUtils.removeAllChildren(this.filename_span);
                this.filename_span.appendChild(document.createTextNode(value));
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push("filename","button-text");
        return CustomExoControl.observedAttributes;
    }
/*
    async upload(filelist, callback) {
        var uploaded = {};
        for (var idx = 0; idx < filelist.length; idx++) {
            await this.upload_file(filelist[idx], uploaded);
        }
        callback(uploaded);
    }

    async upload_file(file, uploaded) {
        var that = this;
        var ab = await file.arrayBuffer();
        var dec = new TextDecoder();
        uploaded[file.name] = dec.decode(ab);
    }
*/
}

customElements.define("exo-file", CustomExoFile);
