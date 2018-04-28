/*****************************************************

	                    ProType
	=================================================
	Copyright © Arthur Guiot 2018. All right reserved.

******************************************************/
class ProType {
	get ViewController() {
		class view {
			constructor(el, viewsName, views) {
				this.view = el
				this.views = views
				this.viewsName = viewsName
			}
			willDisappear() {
				// perform UI changes
			}
			willShow(sender = "Main") {
				// perform UI changes on load.
			}
		}
		return view
	}
	autoMount() {
		const controllers = [...arguments]
		const els = document.querySelectorAll("[protype]")
		this.views.push(...els)
	
		if (els.length != controllers.length) {
			throw "Controllers and Elements don't match"
		}
	
		for (var i = 0; i < els.length; i++) {
			this.viewsName.push(els[i].getAttribute("protype"))
		}
		for (var i = 0; i < controllers.length; i++) { // need to finish register everything
			this.controllers.push(new controllers[i](els[i], this.viewsName, this.views))
		}
	}
	constructor() {
		this.version = "v0.0.2" // ProType version
	
		this.views = []
		this.viewsName = []
	
		this.controllers = []
	}
	mount() {
		const args = [...arguments]
		for (var i = 0; i < args.length; i++) {
			this.views.push(args[i][1])
			this.viewsName.push(args[i][0])
		}
		for (var i = 0; i < args.length; i++) {
			this.controllers.push(new args[i](this.views[i], this.viewsName, this.views))
		}
	}
	performTransition(sender, to, animation = "none", animTime = "1s") {
		const sendIndex = this.viewsName.indexOf(sender)
		const senderView = this.views[sendIndex]
		const senderController = this.controllers[sendIndex]
	
	    const index = this.viewsName.indexOf(to)
	    const view = this.views[index]
		const controller = this.controllers[index]
	
		view.setAttribute("style", "")
		view.style["z-index"] = "-10"
		view.style.display = "block"
		controller.willShow()
	
	    senderView.style.animation = `${animation} ${animTime} forwards`;
	
	    senderView.addEventListener("animationend", e => {
			view.style["z-index"] = "0"
	        senderView.style.display = "none"
	        senderController.willDisappear()
	    })
	}
	set(name) {
		for (var i = 0; i < this.views.length; i++) {
			if (this.viewsName[i] == name) {
				this.views[i].style.display = "block"
				this.controllers[i].willShow()
			} else {
				this.views[i].style.display = "none"
			}
		}
	
	}
}
// Browserify / Node.js
if (typeof define === "function" && define.amd) {
    define(() => new ProType);
    // CommonJS and Node.js module support.
} else if (typeof exports !== "undefined") {
    // Support Node.js specific `module.exports` (which can be a function)
    if (typeof module !== "undefined" && module.exports) {
        exports = module.exports = new ProType;
    }
    // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
    exports.ProType = new ProType;
} else if (typeof global !== "undefined") {
    global.ProType = new ProType;
}