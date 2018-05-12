const P = new ProType();
const glot = new Glottologist();

class Video extends P.Group {
	init() {
		this.state = {
			video: false
		}
		document.querySelector(".video").addEventListener("click", e => {
			this.setState({
				video: !this.state.video
			})
		})
		this.group.addEventListener("click", e => {
			this.setState({
				video: !this.state.video
			})
		})
	}
	changeHandler() {
		let display = "none"
		if (this.state.video) {
			display = "flex"
		}
		this.group.style.display = display
	}
}

class MainViewController extends P.ViewController {
    willShow() {
		glot.import("lang.json").then(() => {
			glot.render()

			this.year = this.view.querySelector("span.year")
	        this.year.innerHTML = new Date().getFullYear()
	        lunarIcons.replace()

	        let span = this.view.querySelector("span.rules")
	        let parent = span.parentNode.parentNode
	        const n = parent.querySelectorAll("h2").length
	        span.innerHTML = n
		})
		this.mountGroup(
			this.view.querySelector(".yt-video"),
			Video
		)
		this.view.querySelector(".seechange").addEventListener("click", e => {
			P.performTransition("changelog", {
				animation: "changelog"
			})
		})
    }
}

class Changelog extends P.ViewController {
    willShow() {
        this.view.querySelector(".exit").addEventListener("click", e => {
            P.performTransition("main", {
				animation: "main"
			})
        })
		this.getGH()
    }

    getGH() {
        fetch("https://api.github.com/repos/arguiot/ProType/releases")
            .then(data => data.json())
            .then(data => {
				this.display(data)
            })
    }
    display(data) {
		let container = this.view.querySelector(".gh-log")
		if (data.length == 0) {
			container.innerHTML = "Nothing to display."
		}
		for (var i = 0; i < data.length; i++) {
			const el = document.createElement("a")
			el.href = data[i].url
			el.innerHTML = `
				<h1>${data[i].tag_name}</h1>
				<h2>${data[i].name}</h2>
				<p>
					${marked(data[i].body)}
				</p>
			`
			container.appendChild(el)
		}
    }
}

P.autoMount(MainViewController, Changelog)

P.set("main")
