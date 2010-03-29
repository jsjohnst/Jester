Jest.fn.extend({
  // event registration, deregistration and execution
  EventSet : function(_el) {

    // handlers can always rely on "this" referring to the watched element
    var element = _el;

    // all event names and their associated functions in an array i.e. "swipe" : [fn1, fn2, fn2]
    var eventsTable = {};

    // register a handler with an event
    this.register = function(eventName, fn) {

      // if the event exists and has handlers attached to it, add this one to the array of them
      if(eventsTable[eventName] && eventsTable[eventName].push) {

        // make sure multiple copies of the same handler aren't inserted
        if(~eventsTable[eventName].indexOf(fn)) {
          eventsTable[eventName].push(fn);
        }
      }
      else {

        // create a new array bound to the event containing only the handler passed in
        eventsTable[eventName] = [fn];
      }
    };

    this.deregister = function(eventName, fn) {

      // pull the given handler from the given event
      if(eventsTable[eventName] && ~eventsTable[eventName].indexOf(fn)) {
        eventsTable[eventName].splice(eventsTable[eventName].indexOf(fn), 1);
      }

      // if the event has no more handlers registered to it, get rid of the event completely
      if(eventsTable[eventName] && eventsTable[eventName].length == 0) {
        delete eventsTable[eventName];
      }
    };

    // completely remove a registered event and all its handlers
    this.clear = function(eventName) {
      if(eventsTable[eventName]) {
        delete eventsTable[eventName];
      }
    };

    // get all the handlers associated with an event
    // return an empty array if nothing is registered with the given event name
    this.getHandlers = function(eventName) {
      if(eventsTable[eventName] && eventsTable[eventName].length) {
        return eventsTable[eventName];
      }
      else {
        return [];
      }
    };

    // inject an array of handlers into the event table for the given event
    // this will klobber all current handlers associated with the event
    this.setHandlers = function(eventName, handlers) {
      eventsTable[eventName] = handlers;
    };

    // execute all handlers associated with an event, passing each handler the arguments provided after the event's name.
    this.execute = function(eventName) {

      // if the event asked for exists in the events table
      if(eventsTable[eventName] && eventsTable[eventName].length) {

        // get the arguments sent to the function
        var args = Array.prototype.slice.call(arguments, 1);

        // iterate throuh all the handlers
        for(i = 0; i < eventsTable[eventName].length; i++) {

          // check current handler is a functions
          if(eventsTable[eventName][i].constructor == Function) {

            // execute handler with the provided arguments
            eventsTable[eventName][i].apply(element, args);
          }
        }
      }
    };
  }
});