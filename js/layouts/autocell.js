/* MIT License - Exo - Copyright (C) 2022-2023 Visual Topology */

/*
    Call this function after the document is loaded (or whenever cell content is updated) to snap the cell width of all cells marked exo-auto-cell
 */
function exo_autocell_snap2grid() {

    function getElementWidth(p,e) {
        var sty = getComputedStyle(p);
        return e.getBoundingClientRect().width +
            parseFloat(sty.getPropertyValue('margin-left')) +
            parseFloat(sty.getPropertyValue('margin-right'));
    }

    var elts = document.getElementsByClassName("exo-auto-cell");
    for(var idx=0; idx<elts.length; idx++) {
        var elt = elts[idx];
        var elt0 = elt.firstElementChild;
        if (elt0) {
            ExoUtils.removeClasses(elt0, /exo-(.*)-cell/);
            var w = getElementWidth(elt,elt0);
            var cells = Math.min(Math.ceil(w/128),12);
            ExoUtils.addClass(elt0,"exo-"+cells+"-cell");
        }
    }
}