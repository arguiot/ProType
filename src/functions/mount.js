mount(Class, el) {
	const classObj = new Class(el, this.viewsName, this.views)
	return classObj
}
