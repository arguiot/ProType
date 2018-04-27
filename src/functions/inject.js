inject() {
	const args = [...arguments]
	for (var i = 0; i < args.length; i++) {
		this.views.push(args[i][1])
		this.viewsName.push(args[i][0])
	}
}
