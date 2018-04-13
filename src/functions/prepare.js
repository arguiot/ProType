prepare(callback) {
	document.addEventListener("DOMContentLoaded", e => {
		callback(...this.classes, e)
	})
}
