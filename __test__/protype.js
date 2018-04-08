/*****************************************************

	                    ProType
	=================================================
	Copyright © Arthur Guiot 2018. All right reserved.

******************************************************/
class ProType {
	get Action() {
		class Action {
			_addEventListener() {
				
			}
			constructor() {
				this._addEventListener()
			}
		}
		return Action;
	}
	constructor() {
		this.version = "v0.0.1" // ProType version
	
		this.classes = []
	}
	get Element() {
		class Element {
			constructor() {
				if (!this.el) {
					throw "[ProType - Element]: Missing element 'this.el' in the child class."
				} else {
					this.el.innerHTML = this.render()
				}
			}
			render() {
				return 0;
			}
		}
		return Element;
	}
	load() {
		this.classes.push(...arguments)
	}
	register(name, Class, opt={}) {
		if (customElements) {
			customElements.define(name, Class, opt)
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