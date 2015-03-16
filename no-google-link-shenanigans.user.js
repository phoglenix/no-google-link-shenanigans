// ==UserScript==
// @name           No Google Link Shenanigans
// @namespace      https://github.com/phoglenix/
// @description    Prevents / reverts link rewriting on Google pages
// @include        /^https?://\w+\.google\.(com|co)(\.[a-z]+)?/.*$/
// ==/UserScript==

String.prototype.toObj = function(s) {
	var r = {}, c = this.split('&'), t;
	for(var i = 0; i < c.length; i++) {
		t = c[i].split('=');
		r[decodeURIComponent(t[0])] = decodeURIComponent(t[1]);
	}
	return r;
}
function anchorMatch(a) {
	for(; a; a = a.parentNode) if(a.localName == 'a') return a;
	return null;
}

function rewriteUrl(e) {
    var a = anchorMatch(e.target);
    if(a && a.localName == "a") {
        var m = a.getAttribute("onmousedown");
        var h = a.getAttribute("href");
        //var ja = a.getAttribute("jsaction");
        if(m && m.indexOf("return") == 0) {
            a.removeAttribute("onmousedown");
        } else if(h) {
            if(h.indexOf("http://") == 0) h = h.substr(h.indexOf("/", 7));
            if(h.indexOf("/url?") == 0) {
                h = h.substr(5).toObj();
                a.setAttribute('href', decodeURIComponent(h.url || h.q));
                a.setAttribute('rel', 'noreferrer');
            }
        }
    }
}

// Google news specific code (doesn't really work) - try to fix
// var a=document.querySelectorAll(".title a, .sources a, .source-link a, .additional-article a, .thumbnail a");
// addEventListener("mousedown", function(e) {
    // var c = anchorMatch(e.target);
    // for(var i = 0; i < a.length; i++) {
        // if(c == a[i]) return e.stopPropagation();
    // }
// }, true);

addEventListener("mousedown", rewriteUrl, true);
addEventListener("mouseup", rewriteUrl, true);
