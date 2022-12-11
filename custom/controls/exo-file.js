/* MIT License - Exo - Copyright (c) 2022 Visual Topology */

class CustomExoFile extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuild("input", parameters);
        this.exoGetElement().setAttribute("type","file");
        var that = this;

        this.exoGetElement().oninput = function (evt) {
            const filelist = that.exoGetElement().files;
            var files = {};
            for(var idx=0; idx<filelist.length;idx++) {
                var file = filelist[idx];
                files[file.name] = file;
            }
            that.dispatchEvent(new CustomEvent("exo-value",{detail:files}));
        }
        this.appendChild(this.exoGetRootElement());
    }

    exoUpdate(name,value) {
        switch(name) {
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoFile.observedAttributes;
    }

    static get observedAttributes() {
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
