var body = document.body;
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = chrome.extension.getURL('coderah_battlelog_mods.js');
body.appendChild(script);