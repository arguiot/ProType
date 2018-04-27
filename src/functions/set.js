set(name) {
	for (var i = 0; i < this.views.length; i++) {
		if (this.viewsName[i] == name) {
			this.views[i].style.display = "block"
		} else {
			this.views[i].style.display = "none"
		}
	}

}
