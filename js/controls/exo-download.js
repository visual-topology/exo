/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

class CustomExoDownload extends CustomExoControl {

    constructor() {
        super();
        this.exo_download_content = null;
        this.exo_download_mimetype = null;
        this.exo_download_href = null;
        this.exo_download_filename = null;
        this.exo_a = null;
    }

    exoBuild(parameters) {
        super.exoBuildCommon("div", parameters);
        this.exoGetInputElement().setAttribute("class","exo-button");

        this.exo_a = document.createElement("a");
        this.exo_a.setAttribute("href","");
        this.exoGetInputElement().appendChild(this.exo_a);
        var that = this;

        this.exo_a.onclick = function (evt) {
            that.dispatchEvent(new CustomEvent("exo-download",{"detail":{}}));
            that.exoSetHref();
        }
        super.exoBuildComplete(parameters);
    }

    exoSetHref() {
        if (!this.exo_download_href) {
            var data_uri = "data:" + this.exo_download_mimetype + ";base64," + btoa(this.exo_download_content);
            this.exo_a.setAttribute("href", data_uri);
        }
    }

    exoUpdate(name,value) {
        switch(name) {
            case "download_filename":
                this.exo_download_filename = value;
                this.exo_a.setAttribute("download", value);
                ExoUtils.removeAllChildren(this.exo_a);
                this.exo_a.appendChild(document.createTextNode(value));
                break;
            case "download_mimetype":
            case "download_content":
                if (name == "download_mimetype") {
                    this.exo_download_mimetype = value;
                } else {
                    this.exo_download_content = value;
                }
                if (this.exo_download_mimetype && this.exo_download_content) {
                    this.exo_download_href = "";
                    this.exo_a.setAttribute("href", this.exo_download_href);
                }
                break;
            case "href":
                this.exo_download_href = value;
                this.exo_a.setAttribute("href", this.exo_download_href);
                break;
            case "fg-color":
                // apply the color to the anchor to override the default link style
                ExoUtils.removeClasses( this.exo_a, /exo-(.*)-fg/);
                ExoUtils.addClass(this.exo_a,"exo-"+value+"-fg");
                super.exoUpdate(name,value);
                break;
            default:
                super.exoUpdate(name,value);
        }
    }

    exoGetAttributeNames() {
        return CustomExoFile.observedAttributes;
    }

    static get observedAttributes() {
        var attrs = CustomExoControl.observedAttributes;
        attrs.push("download_filename");
        attrs.push("download_content");
        attrs.push("download_mimetype");
        attrs.push("href");
        return attrs;
    }

}

customElements.define("exo-download", CustomExoDownload);