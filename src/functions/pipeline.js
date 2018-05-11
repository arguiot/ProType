get pipeline() {
	const viewName = this.currentView;
	const index = this.viewsName.indexOf(viewName)
	const view = this.views[index]
	return view.pipeline;
}
setPipeline(data) {
	const viewName = this.currentView;
	const index = this.viewsName.indexOf(viewName)
	this.views[index].pipeline = data
}
