set(name) {
	document.addEventListener("DOMContentLoaded", e => {
		for (var i = 0; i < this.views.length; i++) {
			if (this.viewsName[i] == name) {
				this.views[i].style.visibility = "visible"
				this.controllers[i].willShow()
			} else {
				this.views[i].style.visibility = "hidden"
			}
		}
	})
}
