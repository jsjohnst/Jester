(function(container) {

  container["Jester"] = {
    cache : {},
    cacheId : "Jester" + (new Date()).getTime(),
    guid : 0,

    // The Jester constructor
    Watcher : function(element, options) {

      var that = this,
          cacheId = Jester.cacheId,
          cache = Jester.cache,
          gestures = "swipe flick tap doubletap";

      if(!element || !element.nodeType) {
        throw new TypeError("Jester: no element given.");
      }

      if(typeof element[cacheId] !== "number") {
        element[cacheId] = Jester.guid;
        Jester.guid++;
      }

      var elementId = element[cacheId];

      if(!cache[element[cacheId]]) {
        cache[element[cacheId]] = {};
      }

      var elementCache = Jester.cache[elementId];

      if(!elementCache["options"]) {
        elementCache["options"] = {};
      }

      options = options || elementCache.options || {};

      // cache the option values for reuse
      if(elementCache.options !== options) {
        for(prop in options) {
          if(elementCache.options[prop]) {
            if(elementCache.options[prop] !== options[prop]) {
              elementCache.options[prop] = options[prop];
            }
          }
          else {
            elementCache.options[prop] = options[prop];
          }
        }
      }

      if(!elementCache["eventSet"]) {
        elementCache["eventSet"] = new Jester.EventSet(element);
      }

      if(!elementCache["touchMonitor"]) {
        elementCache["touchMonitor"] = new Jester.TouchMonitor(element);
      }

      var events = elementCache.eventSet;
      var touches = elementCache.touchMonitor;

      this.id = element[cacheId];

      this.bind = function(evt, fn) {
        if(evt && typeof evt === "string" && fn && fn.constructor === Function) {
          events.register(evt, fn);
        }
        return this;
      };

      // create shortcut bind methods for all gestures
      gestures.split(" ").forEach(function(value) {
        this[value] = function(fn) {
          this.bind(value, fn);
          return this;
        };
      }, that);

      this.halt = function() {
        touches.stopListening();
        events.clear();
        delete elementCache["eventSet"];
        delete elementCache["touchMonitor"];
      };

    },
    EventSet : function(element) {
  
      var cacheId = Jester.cacheId,
          elementId = element[cacheId],
          cache = Jester.cache,
          elementCache = cache[elementId];

      // all event names and their associated functions in an array i.e. "swipe" : [fn1, fn2, fn2]
      var eventsTable = {};
      this.eventsTable = eventsTable;

      // register a handler with an event
      this.register = function(eventName, fn) {
  
        // if the event exists and has handlers attached to it, add this one to the array of them
        if(eventsTable[eventName] && eventsTable[eventName].push) {

          // make sure multiple copies of the same handler aren't inserted
          if(!~eventsTable[eventName].indexOf(fn)) {
            eventsTable[eventName].push(fn);
          }
        }
        else {
  
          // create a new array bound to the event containing only the handler passed in
          eventsTable[eventName] = [fn];
        }

      };
  
      this.release = function(eventName, fn) {

        // if a handler hasn't been specified, remove all handlers
        if(typeof fn === "undefined") {
          for(handlers in eventsTable.eventName) {
            delete eventsTable.eventName[handlers];
          }
        }
        else {
          // pull the given handler from the given event
          if(eventsTable[eventName] && ~eventsTable[eventName].indexOf(fn)) {
            eventsTable[eventName].splice(eventsTable[eventName].indexOf(fn), 1);
          }
        }

        // if the event has no more handlers registered to it, get rid of the event completely
        if(eventsTable[eventName] && eventsTable[eventName].length == 0) {
          delete eventsTable[eventName];
        }
      };

      // completely remove all events and their handlers
      this.clear = function() {
        for(events in eventsTable) {
          delete eventsTable[events];
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
  
            // check current handler is a function
            if(eventsTable[eventName][i].constructor == Function) {
  
              // execute handler with the provided arguments
              eventsTable[eventName][i].apply(element, args);
            }
          }
        }
      };
    },

    TouchMonitor : function(element, events) {

      var cacheId = Jester.cacheId,
          elementId = element[cacheId],
          cache = Jester.cache,
          elementCache = cache[elementId];

  /*
      Options
      -------
  
      opts.bubble         Boolean   Whether or not to bubble touch events performed on the element.
  
      opts.move           Object    { direction: "x" | "y" | "xy", stick: true | false }
      opts.scale          Object    { direction: "x" | "y" | "xy", stick: true | false }
  
      opts.tapDistance    Integer   Maximum distance a finger is allowed to travel for a tap to be registered.
      opts.tapTime        Integer   Maximum time a finger is allowed to have contact with the screen for a tap to be registered.

      opts.doubleTapTime  Integer   The maximum time between two taps to register as a double tap.
  
      opts.swipeDistance  Integer   The minimum distance a gesture must travel before a swipe is registered.
  
      opts.flickTime      Integer   The maximum length of time in milliseconds a gesture can last for it to be registered as a flick.
      opts.flickDistance  Integer   The minimum distance a gesture must travel for it to be registered as a flick.
  
      opts.deadX          Integer   The dead zone on the X-axis in pixels.
      opts.deadY          Integer   The dead zone on the Y-axis in pixels.
  */

      var opts = elementCache.options;

  //  option name             passed value              option default
      opts.bubble         =   opts.bubble           ||  true;
  
      opts.move           =   opts.move             ||  {};
      opts.scale          =   opts.scale            ||  {};

      opts.tapDistance    =   opts.tapDistance      ||  0;
      opts.tapTime        =   opts.tapTime          ||  20;

      opts.doubleTapTime  =   opts.doubleTapTime    ||  300;

      opts.swipeDistance  =   opts.swipeDistance    ||  200;

      opts.flickTime      =   opts.flickTime        ||  300;
      opts.flickDistance  =   opts.flickDistance    ||  200;

      opts.deadX          =   opts.deadX            ||  0;
      opts.deadY          =   opts.deadY            ||  0;

      var eventSet = elementCache.eventSet;

      var touches;
      var previousTapTime = 0;

      var touchStart = function(evt) {
        evt.preventDefault();
        touches = new Jester.TouchGroup(evt);
      };

      var touchMove = function(evt) {
        evt.preventDefault();
        touches.update(evt);
      };

      var touchEnd = function(evt) {
        evt.preventDefault();

        if(touches.numTouches() == 1) {

          // tap
          if(touches.touch(0).total.x() <= opts.tapDistance && touches.touch(0).total.y() <= opts.tapDistance && touches.touch(0).total.time() < opts.tapTime) {
            setTimeout(function() {
              eventSet.execute("tap", touches);
            }, 0);
          }
  
          // doubletap
          if(touches.touch(0).total.time() < opts.tapTime) {
            var now = (new Date()).getTime();
            if(now - previousTapTime <= opts.doubleTapTime) {
              eventSet.execute("doubletap", touches);
            }
            previousTapTime = now;
          }

          // swipe
          if(Math.abs(touches.touch(0).total.x()) >= opts.swipeDistance) {
            var swipeDirection = touches.touch(0).total.x() < 0 ? "left" : "right";
            setTimeout(function() {
              eventSet.execute("swipe", touches, swipeDirection);
            }, 0);
          }

          // flick
          if(Math.abs(touches.touch(0).total.x()) >= opts.flickDistance && touches.touch(0).total.time() <= opts.flickTime) {
            var flickDirection = touches.touch(0).total.x() < 0 ? "left" : "right";
            setTimeout(function() {
              eventSet.execute("flick", touches, flickDirection);
            }, 0);
          }

        }
        else if(touches.numTouches == 2) {
        
        }

      };

      var stopListening = function() {
        element.removeEventListener("touchstart", touchStart, opts.bubble);
        element.removeEventListener("touchmove", touchMove, opts.bubble);
        element.removeEventListener("touchend", touchEnd, opts.bubble);
      };

      element.addEventListener("touchstart", touchStart, opts.bubble);
      element.addEventListener("touchmove", touchMove, opts.bubble);
      element.addEventListener("touchend", touchEnd, opts.bubble);

      return {
        stopListening: stopListening
      };

    },

    TouchGroup : function(event) {


      var that = this;
  
      var numTouches = event.touches.length;
    
      var midpointX = 0;
      var midpointY = 0;
  
      var scale = event.scale;
      var prevScale = scale;
      var deltaScale = scale;

      for(var i = 0; i < numTouches; i++) {
        this["touch" + i] = new Jester.Touch(event.touches[i].pageX, event.touches[i].pageY);
        midpointX = event.touches[i].pageX;
        midpointY = event.touches[i].pageY;
      }

      function getNumTouches() {
        return numTouches;
      }

      function getTouch(num) {
        return that["touch" + num];
      }

      function getMidPointX() {
        return midpointX;
      }
      function getMidPointY() {
        return midpointY;
      }
      function getScale() {
        return scale;
      }
      function getPrevScale() {
        return prevScale;
      }
      function getDeltaScale() {
        return deltaScale;
      }

      function updateTouches(event) {
        var mpX = 0;
        var mpY = 0;
  
        for(var i = 0; i < event.touches.length; i++) {
          if(i < numTouches) {
            that["touch" + i].update(event.touches[i].pageX, event.touches[i].pageY);
            mpX += event.touches[i].pageX;
            mpY += event.touches[i].pageY;
          }
        }
        midpointX = mpX / numTouches;
        midpointY = mpY / numTouches;

        prevScale = scale;
        scale = event.scale;
        deltaScale = scale - prevScale;

      }

      return {
        numTouches: getNumTouches,
        touch: getTouch,
        current: {
          scale: getScale,
          midX: getMidPointX,
          midY: getMidPointY
        },
        delta: {
          scale: getDeltaScale,
        },
        update: updateTouches,
      }
    },

    Touch : function(_startX, _startY) {

      var that = this;



      var startX = _startX;
      var startY = _startY;

      var startTime = now();



      var currentX = startX;
      var currentY = startY;

      var currentTime = startTime;
  
      var currentSpeedX = 0;
      var currentSpeedY = 0;
  
      var currentAccelerationX = 0;
      var currentAccelerationY = 0;
  
  
  
      var prevX = startX;
      var prevY = startX;
  
      var prevTime = startTime;
  
      var prevSpeedX = 0;
      var prevSpeedY = 0;
  
      var prevAccelerationX = 0;
      var prevAccelerationY = 0;
  
  
  
      var deltaX = 0;
      var deltaY = 0;
  
      var deltaTime = 0;
  
      var deltaSpeedX = 0;
      var deltaSpeedY = 0;
  
  
  
      var totalX = 0;
      var totalY = 0;
  
      var totalTime = 0;
  
  
  
      // position getters
      function getStartX() {
        return startX;
      }
      function getStartY() {
        return startY;
      }
      function getCurrentX() {
        return currentX;
      }
      function getCurrentY() {
        return currentY;
      }
      function getPrevX() {
        return prevX;
      }
      function getPrevY() {
        return prevY;
      }
      function getDeltaX() {
        return deltaX;
      }
      function getDeltaY() {
        return deltaY;
      }
      function getTotalX() {
        return totalX;
      }
      function getTotalY() {
        return totalY;
      }
  
      // time getters
      function now() {
        return (new Date()).getTime();
      }
      function getStartTime() {
        return startTime;
      }
      function getCurrentTime() {
        return currentTime;
      }
      function getPrevTime() {
        return prevTime;
      }
      function getDeltaTime() {
        return deltaTime;
      }
      function getTotalTime() {
        return totalTime;
      }
  
      // speed getters
      function getCurrentSpeedX() {
        return currentSpeedX;
      }
      function getCurrentSpeedY() {
        return currentSpeedY;
      }
      function getPrevSpeedX() {
        return prevSpeedX;
      }
      function getPrevSpeedY() {
        return prevSpeedY;
      }
      function getDeltaSpeedX() {
        return deltaSpeedX;
      }
      function getDeltaSpeedY() {
        return deltaSpeedY;
      }
  
      // acceleration getters
      function getCurrentAccelerationX() {
        return currentAccelerationX;
      }
      function getCurrentAccelerationY() {
        return currentAccelerationY;
      }
      function getPrevAccelerationX() {
        return prevAccelerationX;
      }
      function getPrevAccelerationY() {
        return prevAccelerationY;
      }
  
      return {
        start: {
          x: getStartX,
          y: getStartY,
          speedX: 0,
          speedY: 0,
          time: getStartTime
        },
        current: {
          x: getCurrentX,
          y: getCurrentY,
          time: getCurrentTime,
          speedX: getCurrentSpeedX,
          speedY: getCurrentSpeedY,
          accelerationX: getCurrentAccelerationX,
          accelerationY: getCurrentAccelerationY
        },
        prev: {
          x: getPrevX,
          y: getPrevY,
          time: getPrevTime,
          speedX: getPrevSpeedX,
          speedY: getPrevSpeedY,
          accelerationX: getPrevAccelerationX,
          accelerationY: getPrevAccelerationY
        },
        delta: {
          x: getDeltaX,
          y: getDeltaY,
          speedX: getDeltaSpeedX,
          speedY: getDeltaSpeedY,
          time: getDeltaTime
        },
        total: {
          x: getTotalX,
          y: getTotalY,
          time: getTotalTime
        },
        update: function(_x, _y) {
  
          prevX = currentX;
          prevY = currentY;
  
          currentX = _x;
          currentY = _y;
  
          deltaX = currentX - prevX;
          deltaY = currentY - prevY;
  
          totalX = currentX - startX;
          totalY = currentY - startY;
  
  
  
  
          prevTime = currentTime;
  
          currentTime = now();
  
          deltaTime = currentTime - prevTime;
  
          totalTime = currentTime - startTime;
  
  
  
          prevSpeedX = currentSpeedX;
          prevSpeedY = currentSpeedY;
  
          currentSpeedX = deltaX / (deltaTime/1000);
          currentSpeedY = deltaY / (deltaTime/1000);
  
          deltaSpeedX = currentSpeedX - prevSpeedX;
          deltaSpeedY = currentSpeedY - prevSpeedY;
  
  
  
          prevAccelerationX = currentAccelerationX;
          prevAccelerationY = currentAccelerationY;
  
          currentAccelerationX = deltaSpeedX / deltaTime;
          currentAccelerationY = deltaSpeedY / deltaTime;
  
        }
      }


    }
  };

  container["jester"] = function(el, opts) {
    return new Jester.Watcher(el, opts);
  };

}(window));