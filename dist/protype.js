"use strict";

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/*****************************************************

	                    ProType
	=================================================
	Copyright © Arthur Guiot 2018. All right reserved.

******************************************************/
var ProType = (function() {
  _createClass(ProType, [
    {
      key: "mountExternalGroup",
      value: function mountExternalGroup(el, group) {
        var g = new group(el, null);
        return g;
      }
    },
    {
      key: "Router",
      value: function Router() {
        var args = [].concat(Array.prototype.slice.call(arguments));
        var handler = void 0;
        var pattern = "";
        switch (args.length) {
          case 1:
            handler = args[0];
            break;

          default:
            pattern = args[0];
            handler = args[1];
            break;
        }
        var regex = new RegExp(/^:\w*$/);
        var routes = {};
        pattern.split("/").forEach(function(el, i) {
          if (el.match(regex)) {
            routes[i] = el.split(":")[1];
          }
        });
        var rep = new RegExp(/\/:\w*(\/|$)/gi);
        var match = new RegExp(pattern.replace("/\\w*/"));
        document.addEventListener("DOMContentLoaded", function(e) {
          var data = {};

          var url = window.location.href;
          data.url = url;
          var origin = window.location.origin;
          data.origin = origin;
          var path = window.location.pathname;
          data.path = path;
          var hash = window.location.hash;
          data.hash = hash;
          var search = window.location.search.substring(1).split("&");
          var searchObj = {};
          for (var i = 0; i < search.length; i++) {
            var splitted = search[i].split("=");
            searchObj[decodeURIComponent(splitted[0])] = decodeURIComponent(
              splitted[1]
            );
          }
          data.search = searchObj;
          data.pathValue = path.split("/");

          if (path.match(match) && pattern != "") {
            var components = path.split("/");
            var r = {};
            Object.keys(routes).forEach(function(i) {
              r[routes[i]] = components[i];
            });
            handler(data, r);
          }
        });
      }
    },
    {
      key: "autoMount",
      value: function autoMount() {
        var _views;

        var controllers = [].concat(Array.prototype.slice.call(arguments));
        var els = document.querySelectorAll("[protype]");
        (_views = this.views).push.apply(_views, _toConsumableArray(els));

        if (els.length != controllers.length) {
          throw "Controllers and Elements don't match";
        }

        for (var i = 0; i < els.length; i++) {
          this.viewsName.push(els[i].getAttribute("protype"));
        }
        for (var _i = 0; _i < controllers.length; _i++) {
          // need to finish register everything
          this.controllers.push(
            new controllers[_i](els[_i], this.viewsName, this.views)
          );
        }
      }
    },
    {
      key: "Component",
      get: function get() {
        var component = (function() {
          function component(el) {
            _classCallCheck(this, component);

            this.component = el;
            this.state = {};

            this.render();
          }

          _createClass(component, [
            {
              key: "render",
              value: function render() {
                this.component.innerHTML = "";
              }
            }
          ]);

          return component;
        })();

        return component;
      }
    },
    {
      key: "Group",
      get: function get() {
        var group = (function() {
          _createClass(group, [
            {
              key: "changeHandler",
              value: function changeHandler(e) {}
            }
          ]);

          function group(el, viewName) {
            _classCallCheck(this, group);

            this.group = el;
            this.viewName = viewName;
            this.state = {};
            this.init();
          }

          _createClass(group, [
            {
              key: "init",
              value: function init() {}
            },
            {
              key: "mountComponent",
              value: function mountComponent(el, obj) {
                var object = new obj(el);
                return object;
              }
            },
            {
              key: "setState",
              value: function setState(data) {
                if (JSON.stringify(data) != JSON.stringify(this.state)) {
                  this.state = data;

                  this.changeHandler(this.state);
                }
              }
            }
          ]);

          return group;
        })();

        return group;
      }
    },
    {
      key: "ViewController",
      get: function get() {
        var view = (function() {
          function view(el, viewsName, views) {
            _classCallCheck(this, view);

            this.view = el;
            this.views = views;
            this.viewsName = viewsName;
            var index = this.views.indexOf(this.view);
            this.viewName = this.viewsName[index];

            this.pipeline = {};

            this.preload();
          }

          _createClass(view, [
            {
              key: "mountGroup",
              value: function mountGroup(el, ObjectClass) {
                var obj = new ObjectClass(el, this.viewName);
                return obj;
              }
            },
            {
              key: "mountGroups",
              value: function mountGroups(els, ObjectClass) {
                var classes = [];
                for (var i = 0; i < els.length; i++) {
                  classes.push(new ObjectClass(els[i], this.viewName));
                }
                return classes;
              }
            },
            {
              key: "onPipelineChange",
              value: function onPipelineChange(pipeline) {
                // Handle the event
              }
            },
            {
              key: "preload",
              value: function preload() {
                // Do stuff that doesn't require DOM interaction
              }
            },
            {
              key: "prepareForSegue",
              value: function prepareForSegue(nextVC) {
                // Do something with nextVC
              }
            },
            {
              key: "willDisappear",
              value: function willDisappear() {
                // perform UI changes

                var sender =
                  arguments.length > 0 && arguments[0] !== undefined
                    ? arguments[0]
                    : "Main";
              }
            },
            {
              key: "willShow",
              value: function willShow() {
                // perform UI changes on load.

                var sender =
                  arguments.length > 0 && arguments[0] !== undefined
                    ? arguments[0]
                    : "Main";
              }
            }
          ]);

          return view;
        })();

        return view;
      }
    }
  ]);

  function ProType() {
    _classCallCheck(this, ProType);

    this.version = "v1.1.0"; // ProType version

    this.views = [];
    this.viewsName = [];

    this.controllers = [];

    this.currentView = "";
    this.last = "";
    this.root = "";

    this.workspace = {}; // share data between views
  }

  _createClass(ProType, [
    {
      key: "mount",
      value: function mount() {
        var args = [].concat(Array.prototype.slice.call(arguments));
        for (var i = 0; i < args.length; i++) {
          this.views.push(args[i][1]);
          this.viewsName.push(args[i][0]);
        }
        for (var _i2 = 0; _i2 < args.length; _i2++) {
          this.controllers.push(
            new args[_i2][2](this.views[_i2], this.viewsName, this.views)
          );
        }
      }
    },
    {
      key: "performTransition",
      value: function performTransition(to, options) {
        if (to == this.currentView) {
          return;
        }
        var opt = Object.assign(
          {
            animation: "none",
            duration: "1s",
            Group: false
          },
          options
        );

        var sender = this.currentView;
        var sendIndex = this.viewsName.indexOf(sender);
        var senderView = this.views[sendIndex];
        var senderController = this.controllers[sendIndex];

        var index = this.viewsName.indexOf(to);
        var viewBis = this.views[index].cloneNode(true);
        this.views[index].parentNode.replaceChild(viewBis, this.views[index]);

        this.views[index] = viewBis;

        var view = this.views[index];
        var controller = this.controllers[index];

        controller.view = view;
        controller.views = this.views;

        this.last = this.currentView;
        this.currentView = to;

        view.setAttribute("style", "");
        view.style["z-index"] = "-10";

        senderController.prepareForSegue(controller);

        controller.willShow(sender);

        if (opt.Group !== false) {
          var after = function after() {
            view.style.display = "block";
            view.style["z-index"] = "0";
            senderView.style.display = "none";
            senderController.willDisappear(sender);
          };
          if (opt.animation !== "none") {
            opt.Group.style.animation =
              opt.animation + " " + opt.duration + " forwards";

            opt.Group.addEventListener("animationend", function(e) {
              return after();
            });
          } else {
            after();
          }
        } else {
          view.style.display = "block";

          var _after = function _after() {
            view.style["z-index"] = "0";
            senderView.style.display = "none";
            senderController.willDisappear(sender);
            view.style.display = "block";
          };
          if (opt.animation !== "none") {
            senderView.style.animation =
              opt.animation + " " + opt.duration + " forwards";

            senderView.addEventListener("animationend", function(e) {
              return _after();
            });
          } else {
            _after();
          }
        }
      }
    },
    {
      key: "setPipeline",
      value: function setPipeline(data) {
        var viewName = this.currentView;
        var index = this.viewsName.indexOf(viewName);
        var old = this.views[index].pipeline;
        if (JSON.stringify(old) != JSON.stringify(data)) {
          this.views[index].pipeline = data;
          this.views[index].onPipelineChange(data);
        }
      }
    },
    {
      key: "pop",
      value: function pop() {
        this.performTransition(this.last);
      }
    },
    {
      key: "popToRoot",
      value: function popToRoot() {
        this.performTransition(this.root);
      }
    },
    {
      key: "set",
      value: function set(name) {
        var _this = this;

        this.root = name;
        this.currentView = name;
        document.addEventListener("DOMContentLoaded", function(e) {
          for (var i = 0; i < _this.views.length; i++) {
            if (_this.viewsName[i] == name) {
              _this.views[i].style.display = "block";
              _this.controllers[i].willShow();
            } else {
              _this.views[i].style.display = "none";
            }
          }
        });
      }
    },
    {
      key: "pipeline",
      get: function get() {
        var viewName = this.currentView;
        var index = this.viewsName.indexOf(viewName);
        var view = this.views[index];
        return view.pipeline;
      }
    }
  ]);

  return ProType;
})();
// Browserify / Node.js

if (typeof define === "function" && define.amd) {
  define(function() {
    return new ProType();
  });
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
