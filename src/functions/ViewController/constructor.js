constructor(el, viewsName, views) {
	this.view = el
	this.views = views
	this.viewsName = viewsName
	const index = this.views.indexOf(this.view)
	this.viewName = this.viewsName[index]

	this.pipeline = {}

	this.preload()
}
