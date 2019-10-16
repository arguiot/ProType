Router() {
    const args = [...arguments]
    let handler;
    let pattern = ""
    switch (args.length) {
        case 1:
            handler = args[0]
            break;
    
        default:
            pattern = args[0]
            handler = args[1]
            break;
    }
    const regex = new RegExp(/^:\w*$/)
    const routes = {}
    pattern.split("/").forEach((el, i) => {
        if (el.match(regex)) {
            routes[i] = el.split(":")[1]
        }
    })
    const rep = new RegExp(/\/:\w*(\/|$)/gi)
    const match = new RegExp(pattern.replace("/\\w*/"))
    document.addEventListener("DOMContentLoaded", e => {
        let data = {};

        const url = window.location.href
        data.url = url
        const origin = window.location.origin
        data.origin = origin
        const path = window.location.pathname
        data.path = path
        const hash = window.location.hash
        data.hash = hash
        const search = window.location.search.substring(1).split("&")
        let searchObj = {}
        for (let i = 0; i < search.length; i++) {
            const splitted = search[i].split("=")
            searchObj[decodeURIComponent(splitted[0])] = decodeURIComponent(splitted[1])
        }
        data.search = searchObj
		data.pathValue = path.split("/")

        if (path.match(match) && pattern != "") {
            const components = path.split("/")
            let r = {}
            Object.keys(routes).forEach(i => {
                r[routes[i]] = components[i]
            })
            handler(data, r)
        }
    })
}
