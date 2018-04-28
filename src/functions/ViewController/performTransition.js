performTransition(to, animation = "none", animTime = "1s", sender = "Any") {
	const index = this.viewsName.indexOf(to)
	const view = this.views[index]
	view.setAttribute("style", "")
	view.style["z-index"] = "-10"
	view.style.display = "block"
	this.view.style.animation = `${animation} ${animTime} forwards`;
	this.view.addEventListener("animationend", e => {
		view.style["z-index"] = "0"
		this.view.style.display = "none"
		this.willDisappear()
	})
}
