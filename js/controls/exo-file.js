/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class CustomExoFile extends CustomExoControl {

    constructor() {
        super();
    }

    exoBuild(parameters) {
        super.exoBuildCommon("input", parameters);
        this.exoGetInputElement().setAttribute("type","file");
        var that = this;

        this.exoGetInputElement().oninput = function (evt) {
            const filelist = that.exoGetInputElement().files;
            var files = {};
            for(var idx=0; idx<filelist.length;idx++) {
                var file = filelist[idx];
                files[file.name] = file;
            }
            that.dispatchEvent(new CustomEvent("exo-file-changed",{detail:files}));
        }
        super.exoBuildComplete(parameters);
    }

    exoUpdate(name,value) {
        switch(name) {
            default:
                super.exoUpdate(name,value);
        }
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
