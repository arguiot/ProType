get pipeline() {
	const viewName = this.currentView;
	const index = this.viewsName.indexOf(viewName)
	const view = this.views[index]
	return view.pipeline;
}
setPipeline(data) {
	const viewName = this.currentView;
	const index = this.viewsName.indexOf(viewName)
	const old = this.views[index].pipeline
	if (JSON.stringify(old) != JSON.stringify(data)) {
		this.views[index].pipeline = data
		this.views[index].onPipelineChange(data)
	}
}
