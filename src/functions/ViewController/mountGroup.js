mountGroup(el, ObjectClass) {
	const obj = new ObjectClass(el, el.getAttribute("protype-group"), this.viewName)
	return obj;
}
