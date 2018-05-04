performTransition(to, options) {
	const opt = Object.assign({
		animation: "none",
		animTime: "1s",
		senderGroup: false
	})
	const sender = this.currentView
	const sendIndex = this.viewsName.indexOf(sender)
	const senderView = this.views[sendIndex]
	const senderController = this.controllers[sendIndex]

    const index = this.viewsName.indexOf(to)
    const view = this.views[index]
	const controller = this.controllers[index]

	this.currentView = to;

	view.setAttribute("style", "")
	view.style["z-index"] = "-10"

	controller.willShow()
	if (opt.senderGroup) {
		senderGroup.group.style.animation = `${opt.animation} ${opt.animTime} forwards`;

		senderGroup.addEventListener("animationend", e => {
			view.style.display = "block"
			view.style["z-index"] = "0"
	        senderView.style.display = "none"
	        senderController.willDisappear()
	    })
	} else {
		view.style.display = "block"

		senderView.style.animation = `${opt.animation} ${opt.animTime} forwards`;

		senderView.addEventListener("animationend", e => {
			view.style["z-index"] = "0"
	        senderView.style.display = "none"
	        senderController.willDisappear()
	    })
	}

}
