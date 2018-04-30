autoMount() {
	const controllers = [...arguments]
	const els = document.querySelectorAll("[protype]")
	this.views.push(...els)

	if (els.length != controllers.length) {
		throw "Controllers and Elements don't match"
	}

	for (let i = 0; i < els.length; i++) {
		this.viewsName.push(els[i].getAttribute("protype"))
	}
	for (let i = 0; i < controllers.length; i++) { // need to finish register everything
		this.controllers.push(new controllers[i](els[i], this.viewsName, this.views))
	}
}
