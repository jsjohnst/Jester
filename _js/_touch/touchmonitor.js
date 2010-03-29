// TouchMonitor watches touches on an element, maintains state and triggers events

Jest.fn.extend({

  TouchMonitor : function(_el, _events, _opts) {

/*
    Options
    -------

    opts.bubble         Boolean   Whether or not to bubble touch events performed on the element.

    opts.move           Object    { direction: "x" | "y" | "xy", stick: true | false }
    opts.scale          Object    { direction: "x" | "y" | "xy", stick: true | false }

    opts.doubleTapTime  Integer   The maximum time between two taps to register as a double tap.

    opts.swipeDistance  Integer   The minimum distance a gesture must travel before a swipe is registered.

    opts.flickTime      Integer   The maximum length of time in milliseconds a gesture can last for it to be registered as a flick.
    opts.flickDistance  Integer   The minimum distance a gesture must travel for it to be registered as a flick.

    opts.deadX          Integer   The dead zone on the X-axis in pixels.
    opts.deadY          Integer   The dead zone on the Y-axis in pixels.
*/
  
    var opts = _opts;

//  option name             passed value              option default
    opts.bubble         =   opts.bubble           ||  true;

    opts.move           =   opts.move             ||  "";
    opts.scale          =   opts.scale            ||  false;

    opts.doubleTapTime  =   opts.doubleTapTime    ||  300;

    opts.swipeDistance  =   opts.swipeDistance    ||  200;

    opts.flickTime      =   opts.flickTime        ||  300;
    opts.flickDistance  =   opts.flickDistance    ||  200;

    opts.deadX          =   opts.deadX            ||  0;
    opts.deadY          =   opts.deadY            ||  0;

    var element = _el;
    var eventSet = _events;

    var touches;
    var previousTapTime;

    element.addEventListener("touchstart", function(evt) {
      evt.preventDefault();
      touches = new Jest.fn.TouchGroup(evt);
    }, opts.bubble);

    element.addEventListener("touchmove", function(evt) {
      evt.preventDefault();
      touches.update(evt);
    }, opts.bubble);

    element.addEventListener("touchend", function(evt) {
      evt.preventDefault();

      if(Math.abs(touches.touch(0).total.x()) > opts.swipeDistance) {
        var swipeDirection = touches.touch(0).total.x() < 0 ? "left" : "right";

        // clear batched css changes
        setTimeout(function() {
          eventSet.execute("swipe", touches, swipeDirection, evt);
        }, 0);
      }
    }, opts.bubble);

  },
});