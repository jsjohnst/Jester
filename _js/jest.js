// this is what you call to get a new jest object and start monitoring gestures
var jest = function(element, options) {
  return new Jest(element, options);
}

// the Jest constructor
var Jest = function(_el, _opts) {

  // if an element hasn't been passed in, throw an error
  if(!_el || typeof _el.nodeType === "undefined") {
    throw new TypeError("Jest Constructor: A DOM element was not provided.");
  }

  var element = _el;

  var opts = _opts || {};

  // event bindings
  var events = new this.EventSet(element);

  // gesture tracking and event triggering
  var touchMon = new this.TouchMonitor(element, events, opts);

  this.bind = function(eventName, func) {
    if(func && func.constructor == Function) {
      events.register(eventName, func);
    }
  };

  this.unbind = function(eventName, func) {
    events.deregister(eventName, func);
  };

};

// ez prototype extension
Jest.fn = Jest.prototype;

Jest.fn.extend = function(obj) {
  for(property in obj) {
    // shallow copy properties
    if(obj.hasOwnProperty(property)) {
      Jest.prototype[property] = obj[property];
    }
  }
};