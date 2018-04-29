setState(data) {
	this.state = data
	this.changeHandler({
		object: this.state
	})
}
