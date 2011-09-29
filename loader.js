var body = document.getElementsByTagName('body')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = chrome.extension.getURL( 'json2.js');
body.appendChild(script);

script = document.createElement('script');
script.type = 'text/javascript';
script.src = chrome.extension.getURL( 'coderah_battlelog_mods.js');
body.appendChild(script);