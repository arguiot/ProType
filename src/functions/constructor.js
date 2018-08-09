constructor() {
	this.version = "%%GULP_INJECT_VERSION%%" // ProType version

	this.views = []
	this.viewsName = []

	this.controllers = []

	this.currentView = "";
	this.last = "";
	this.root = "";

	this.workspace = {} // share data between views
}
