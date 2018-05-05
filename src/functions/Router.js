Router(handler) {

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

        handler(data)
    })
}
