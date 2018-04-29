mountGroup(el, ObjectClass) {
	const obj = ObjectClass(el, el.getAttribute("protype-group"), this.viewName)
	return obj;
}
