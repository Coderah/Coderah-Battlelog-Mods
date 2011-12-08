mods.states = {
	mods: {},
	
	update: function(name) {
		$("#mod-status-" + name.replace(" ", "-")).html(this.mods[name]);
	},
	
	get: function(name) {
		return this.mods[name];
	},
	
	add: function(name) {
		this.mods[name] = "not ready";
		
		if (!$("#mod-status-" + name.replace(" ", "-"))[0]) {
			$("#mods-status").append(name + ': <div class="mod-status" id="mod-status-' + name.replace(" ", "-") + '"></div><br>');
		}
		
		this.update(name);
	},
	
	ready: function(name) {
		this.mods[name] = "ready";
		this.update(name);
	},
	
	error: function(name) {
		this.mods[name] = "error";
		this.update(name);
	}
}