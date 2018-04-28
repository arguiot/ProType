window.onscroll = () => {
	if (window.scrollY >= window.innerHeight && root.interval != null) {
		clearInterval(root.interval)
		root.interval = null
	} else if (window.scrollY < window.innerHeight && root.interval == null) {
		root.interval = setInterval(() => {
			root.update();
	        root.render();
		}, 1000 / 24)
	}
}
