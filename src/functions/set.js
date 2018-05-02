set(name) {
	this.currentView = name;
	document.addEventListener("DOMContentLoaded", e => {
		for (var i = 0; i < this.views.length; i++) {
			if (this.viewsName[i] == name) {
				this.views[i].style.display = "block"
				this.controllers[i].willShow()
			} else {
				this.views[i].style.display = "none"
			}
		}
	})
}
