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
			performTransition(to, animation = "none", animTime = "1s", sender = "Any") {
				const index = this.viewsName.indexOf(to)
				const view = this.views[index]
				view.setAttribute("style", "")
				view.style["z-index"] = "-10"
				view.style.display = "block"
				this.view.style.animation = `${animation} ${animTime} forwards`;
				this.view.addEventListener("animationend", e => {
					view.style["z-index"] = "0"
					this.view.style.display = "none"
					this.willDisappear()
				})
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
	autoInject() {
		const els = document.querySelectorAll("[protype]")
		this.views.push(...els)
		for (var i = 0; i < els.length; i++) {
			this.viewsName.push(els[i].getAttribute("protype"))
		}
	}
	constructor() {
		this.version = "v0.0.2" // ProType version
	
		this.views = []
		this.viewsName = []
	}
	inject() {
		const args = [...arguments]
		for (var i = 0; i < args.length; i++) {
			this.views.push(args[i][1])
			this.viewsName.push(args[i][0])
		}
	}
	mount(Class, el) {
		const classObj = new Class(el, this.viewsName, this.views)
		return classObj
	}
	set(name) {
		for (var i = 0; i < this.views.length; i++) {
			if (this.viewsName[i] == name) {
				this.views[i].style.display = "block"
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