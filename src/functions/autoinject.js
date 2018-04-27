autoInject() {
	const els = document.querySelectorAll("[protype]")
	this.views.push(...els)
	for (var i = 0; i < els.length; i++) {
		this.viewsName.push(els[i].getAttribute("protype"))
	}
}
