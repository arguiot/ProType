performTransition(to, options) {
    const opt = Object.assign({
        animation: "none",
        duration: "1s",
        Group: false
    }, options)

    const sender = this.currentView
    const sendIndex = this.viewsName.indexOf(sender)
    const senderView = this.views[sendIndex]
    const senderController = this.controllers[sendIndex]

    const index = this.viewsName.indexOf(to)
    const viewBis = this.views[index].cloneNode(true);
    this.views[index].parentNode.replaceChild(viewBis, this.views[index])

    this.views[index] = viewBis

    const view = this.views[index]
    const controller = this.controllers[index]

    controller.view = view
    controller.views = this.views;

	this.last = this.currentView
    this.currentView = to;

    view.setAttribute("style", "")
    view.style["z-index"] = "-10"

    controller.willShow(sender)

    if (opt.Group !== false) {
        const after = () => {
            view.style.display = "block"
            view.style["z-index"] = "0"
            senderView.style.display = "none"
            senderController.willDisappear(sender)
        }
        if (opt.animation !== "none") {
            opt.Group.style.animation = `${opt.animation} ${opt.duration} forwards`;

            opt.Group.addEventListener("animationend", e => after())
        } else {
            after()
        }

    } else {
        view.style.display = "block"

        const after = () => {
            view.style["z-index"] = "0"
            senderView.style.display = "none"
            senderController.willDisappear()
            view.style.display = "block"
        }
        if (opt.animation !== "none") {
            senderView.style.animation = `${opt.animation} ${opt.duration} forwards`;

            senderView.addEventListener("animationend", e => after())
        } else {
            after()
        }

    }

}
