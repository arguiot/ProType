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

	if (opt.senderGroup !== false) {
		function after() {
			view.style.display = "block"
			view.style["z-index"] = "0"
	        senderView.style.display = "none"
	        senderController.willDisappear()
	    }
		if (opt.animation !== "none") {
			opt.senderGroup.group.style.animation = `${opt.animation} ${opt.animTime} forwards`;

			opt.senderGroup.addEventListener("animationend", e => after())
		} else {
			after()
		}

	} else {
		view.style.display = "block"

		function after() {
			view.style["z-index"] = "0"
	        senderView.style.display = "none"
	        senderController.willDisappear()
			view.style.display = "block"
	    }

		if (opt.animation !== "none") {
			senderView.style.animation = `${opt.animation} ${opt.animTime} forwards`;

			senderView.addEventListener("animationend", e => after())
		} else {
			after()
		}

	}

}
