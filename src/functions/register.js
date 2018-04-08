register(name, Class, opt={}) {
	if (customElements) {
		customElements.define(name, Class, opt)
	}
}
