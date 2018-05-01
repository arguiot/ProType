const P = new ProType();

class UIViewController extends P.ViewController {
	willShow() {
		this.year = this.view.querySelector("span.year")
		this.year.innerHTML = new Date().getFullYear()
		lunarIcons.replace()

		let span = this.view.querySelector("span.rules")
		let parent = span.parentNode.parentNode
		const n = parent.querySelectorAll("h2").length
		span.innerHTML = n
	}
}

P.autoMount(UIViewController)

P.set("main")
