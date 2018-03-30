constructor() {
	if (!this.el) {
		throw "[ProType - Element]: Missing element 'this.el' in the child class."
	} else {
		this.el.innerHTML = this.render()
	}
}
