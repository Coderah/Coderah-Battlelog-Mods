// ==UserScript==
// @name            Coderah Battlelog Mods
// @author          Alex Howard
// @namespace       http://www.coderah.com/?page_id=389
// @description     Multiple modifications for Battlelog (bf3 beta)
// @version	        <?version?>
// @include         http://battlelog.battlefield.com/*
// ==/UserScript==

function coderah_battlelog_mods_main () {
	<?mainCode?>

	<?updateCode?>
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ coderah_battlelog_mods_main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
