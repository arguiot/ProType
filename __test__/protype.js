/*****************************************************

	                    ProType
	=================================================
	Copyright © Arthur Guiot 2018. All right reserved.

******************************************************/
class ProType {
	get Group() {
		class group {
			changeHandler(e) {
			
			}
			constructor(el, groupName, viewName) {
				this.group = el
				this.groupName = groupName
				this.viewName = viewName
				this.state = {}
				this.init()
			}
			init() {
				
			}
			setState(data, handler) {
				if (JSON.stringify(data) != JSON.stringify(this.state)) {
					this.state = data
			
					handler(this.state)
				}
			}
		}
		return group
	}
	get ViewController() {
		class view {
			constructor(el, viewsName, views) {
				this.view = el
				this.views = views
				this.viewsName = viewsName
				const index = this.views.indexOf(this.view)
				this.viewName = this.viewsName[index]
			}
			mountGroup(el, ObjectClass) {
				const obj = new ObjectClass(el, el.getAttribute("protype-group"), this.viewName)
				return obj;
			}
			willDisappear(sender = "Main") {
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
	
		for (let i = 0; i < els.length; i++) {
			this.viewsName.push(els[i].getAttribute("protype"))
		}
		for (let i = 0; i < controllers.length; i++) { // need to finish register everything
			this.controllers.push(new controllers[i](els[i], this.viewsName, this.views))
		}
	}
	constructor() {
		this.version = "v0.0.10" // ProType version
	
		this.views = []
		this.viewsName = []
	
		this.controllers = []
	
		this.currentView = "";
	}
	mount() {
		const args = [...arguments]
		for (let i = 0; i < args.length; i++) {
			this.views.push(args[i][1])
			this.viewsName.push(args[i][0])
		}
		for (let i = 0; i < args.length; i++) {
			this.controllers.push(new args[i][2](this.views[i], this.viewsName, this.views))
		}
	}
	performTransition(to, options) {
		const opt = Object.assign({
			animation: "none",
			animTime: "1s",
			senderGroup: false
		})
		const sender = this.currentView
		const sendIndex = this.viewsName.indexOf(sender)
		const senderView = this.views[sendIndex]
		const senderController = this.controllers[sendIndex]
	
	    const index = this.viewsName.indexOf(to)
	    const view = this.views[index]
		const controller = this.controllers[index]
	
		this.currentView = to;
	
		view.setAttribute("style", "")
		view.style["z-index"] = "-10"
		view.style.display = "block"
		controller.willShow()
		if (opt.senderGroup) {
			senderGroup.group.style.animation = `${opt.animation} ${opt.animTime} forwards`;
	
			senderGroup.addEventListener("animationend", e => {
				view.style["z-index"] = "0"
		        senderView.style.display = "none"
		        senderController.willDisappear()
		    })
		} else {
			senderView.style.animation = `${opt.animation} ${opt.animTime} forwards`;
	
			senderView.addEventListener("animationend", e => {
				view.style["z-index"] = "0"
		        senderView.style.display = "none"
		        senderController.willDisappear()
		    })
		}
	
	}
	set(name) {
		this.currentView = name;
		document.addEventListener("DOMContentLoaded", e => {
			for (var i = 0; i < this.views.length; i++) {
				if (this.viewsName[i] == name) {
					this.views[i].style.display = "block"
					this.controllers[i].willShow()
				} else {
					this.views[i].style.display = "none"
				}
			}
		})
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