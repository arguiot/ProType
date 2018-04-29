const P = new ProType();

class UIViewController extends P.ViewController {
	willShow() {
		this.year = this.view.querySelector("span.year")
		this.year.innerHTML = new Date().getFullYear()
	}
}

P.autoMount(UIViewController)

P.set("main")
