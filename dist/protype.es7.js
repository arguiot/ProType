/*****************************************************

	                    ProType
	=================================================
	Copyright © Arthur Guiot 2018. All right reserved.

******************************************************/
class ProType {
  get Component() {
    class component {
      constructor(el) {
        this.component = el;
        this.state = {};

        this.render();
      }
      render() {
        this.component.innerHTML = "";
      }
    }
    return component;
  }
  mountExternalGroup(el, group) {
    const g = new group(el, null);
    return g;
  }
  get Group() {
    class group {
      changeHandler(e) {}
      constructor(el, viewName) {
        this.group = el;
        this.viewName = viewName;
        this.state = {};
        this.init();
      }
      init() {}
      mountComponent(el, obj) {
        const object = new obj(el);
        return object;
      }
      setState(data) {
        if (JSON.stringify(data) != JSON.stringify(this.state)) {
          this.state = data;

          this.changeHandler(this.state);
        }
      }
    }
    return group;
  }
  Router(handler) {
    document.addEventListener("DOMContentLoaded", e => {
      let data = {};

      const url = window.location.href;
      data.url = url;
      const origin = window.location.origin;
      data.origin = origin;
      const path = window.location.pathname;
      data.path = path;
      const hash = window.location.hash;
      data.hash = hash;
      const search = window.location.search.substring(1).split("&");
      let searchObj = {};
      for (let i = 0; i < search.length; i++) {
        const splitted = search[i].split("=");
        searchObj[decodeURIComponent(splitted[0])] = decodeURIComponent(
          splitted[1]
        );
      }
      data.search = searchObj;
      data.pathValue = path.split("/");

      handler(data);
    });
  }
  get ViewController() {
    class view {
      constructor(el, viewsName, views) {
        this.view = el;
        this.views = views;
        this.viewsName = viewsName;
        const index = this.views.indexOf(this.view);
        this.viewName = this.viewsName[index];

        this.pipeline = {};

        this.preload();
      }
      mountGroup(el, ObjectClass) {
        const obj = new ObjectClass(el, this.viewName);
        return obj;
      }

      mountGroups(els, ObjectClass) {
        let classes = [];
        for (let i = 0; i < els.length; i++) {
          classes.push(new ObjectClass(els[i], this.viewName));
        }
        return classes;
      }
      onPipelineChange(pipeline) {
        // Handle the event
      }
      preload() {
        // Do stuff that doesn't require DOM interaction
      }
      prepareForSegue(nextVC) {
        // Do something with nextVC
      }
      willDisappear(sender = "Main") {
        // perform UI changes
      }
      willShow(sender = "Main") {
        // perform UI changes on load.
      }
    }
    return view;
  }
  autoMount() {
    const controllers = [...arguments];
    const els = document.querySelectorAll("[protype]");
    this.views.push(...els);

    if (els.length != controllers.length) {
      throw "Controllers and Elements don't match";
    }

    for (let i = 0; i < els.length; i++) {
      this.viewsName.push(els[i].getAttribute("protype"));
    }
    for (let i = 0; i < controllers.length; i++) {
      // need to finish register everything
      this.controllers.push(
        new controllers[i](els[i], this.viewsName, this.views)
      );
    }
  }
  constructor() {
    this.version = "v1.1.0"; // ProType version

    this.views = [];
    this.viewsName = [];

    this.controllers = [];

    this.currentView = "";
    this.last = "";
    this.root = "";

    this.workspace = {}; // share data between views
  }
  mount() {
    const args = [...arguments];
    for (let i = 0; i < args.length; i++) {
      this.views.push(args[i][1]);
      this.viewsName.push(args[i][0]);
    }
    for (let i = 0; i < args.length; i++) {
      this.controllers.push(
        new args[i][2](this.views[i], this.viewsName, this.views)
      );
    }
  }
  performTransition(to, options) {
    if (to == this.currentView) {
      return;
    }
    const opt = Object.assign(
      {
        animation: "none",
        duration: "1s",
        Group: false
      },
      options
    );

    const sender = this.currentView;
    const sendIndex = this.viewsName.indexOf(sender);
    const senderView = this.views[sendIndex];
    const senderController = this.controllers[sendIndex];

    const index = this.viewsName.indexOf(to);
    const viewBis = this.views[index].cloneNode(true);
    this.views[index].parentNode.replaceChild(viewBis, this.views[index]);

    this.views[index] = viewBis;

    const view = this.views[index];
    let controller = this.controllers[index];

    controller.view = view;
    controller.views = this.views;

    this.last = this.currentView;
    this.currentView = to;

    view.setAttribute("style", "");
    view.style["z-index"] = "-10";

    senderController.prepareForSegue(controller);

    controller.willShow(sender);

    if (opt.Group !== false) {
      const after = () => {
        view.style.display = "block";
        view.style["z-index"] = "0";
        senderView.style.display = "none";
        senderController.willDisappear(sender);
      };
      if (opt.animation !== "none") {
        opt.Group.style.animation = `${opt.animation} ${opt.duration} forwards`;

        opt.Group.addEventListener("animationend", e => after());
      } else {
        after();
      }
    } else {
      view.style.display = "block";

      const after = () => {
        view.style["z-index"] = "0";
        senderView.style.display = "none";
        senderController.willDisappear(sender);
        view.style.display = "block";
      };
      if (opt.animation !== "none") {
        senderView.style.animation = `${opt.animation} ${
          opt.duration
        } forwards`;

        senderView.addEventListener("animationend", e => after());
      } else {
        after();
      }
    }
  }
  get pipeline() {
    const viewName = this.currentView;
    const index = this.viewsName.indexOf(viewName);
    const view = this.views[index];
    return view.pipeline;
  }
  setPipeline(data) {
    const viewName = this.currentView;
    const index = this.viewsName.indexOf(viewName);
    const old = this.views[index].pipeline;
    if (JSON.stringify(old) != JSON.stringify(data)) {
      this.views[index].pipeline = data;
      this.views[index].onPipelineChange(data);
    }
  }
  pop() {
    this.performTransition(this.last);
  }
  popToRoot() {
    this.performTransition(this.root);
  }
  set(name) {
    this.root = name;
    this.currentView = name;
    document.addEventListener("DOMContentLoaded", e => {
      for (var i = 0; i < this.views.length; i++) {
        if (this.viewsName[i] == name) {
          this.views[i].style.display = "block";
          this.controllers[i].willShow();
        } else {
          this.views[i].style.display = "none";
        }
      }
    });
  }
}
// Browserify / Node.js
if (typeof define === "function" && define.amd) {
  define(() => new ProType());
  // CommonJS and Node.js module support.
} else if (typeof exports !== "undefined") {
  // Support Node.js specific `module.exports` (which can be a function)
  if (typeof module !== "undefined" && module.exports) {
    exports = module.exports = new ProType();
  }
  // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
  exports.ProType = new ProType();
} else if (typeof global !== "undefined") {
  global.ProType = new ProType();
}
