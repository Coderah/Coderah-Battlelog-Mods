// ==UserScript==
// @name            Coderah Battlelog Mods
// @author          Alex Howard
// @namespace       http://www.coderah.com/?page_id=389
// @description     Multiple modifications for Battlelog (BF3)
// @version	        <?version?>
// @include         http://battlelog.battlefield.com/*
// ==/UserScript==

function coderah_battlelog_mods_main () {
	<?mainCode?>

	<?updateCode?>
}

function contentEval(source) {
  if ('function' == typeof source) {
    source = '(' + source + ')();'
  }

  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;
  document.body.appendChild(script);
}

contentEval(coderah_battlelog_mods_main);

