mountGroup(el, ObjectClass) {
	const obj = new ObjectClass(el, this.viewName)
	return obj;
}

mountGroups(els, ObjectClass) {
	let classes = []
	for (let i = 0; i < els.length; i++) {
		classes.push(new ObjectClass(els[i], this.viewName))
	}
	return classes
}
