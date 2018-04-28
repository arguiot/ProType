performTransition(sender, to, animation = "none", animTime = "1s") {
	const sendIndex = this.viewsName.indexOf(sender)
	const senderView = this.views[sendIndex]
	const senderController = this.controllers[sendIndex]

    const index = this.viewsName.indexOf(to)
    const view = this.views[index]
	const controller = this.controllers[index]

	view.setAttribute("style", "")
	view.style["z-index"] = "-10"
	view.style.display = "block"
	controller.willShow()

    senderView.style.animation = `${animation} ${animTime} forwards`;

    senderView.addEventListener("animationend", e => {
		view.style["z-index"] = "0"
        senderView.style.display = "none"
        senderController.willDisappear()
    })
}
