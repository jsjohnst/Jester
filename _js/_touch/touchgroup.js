Jester.fn.extend({
  // The TouchGroup class represents and maintains information about collections of touches
  TouchGroup : function(event) {
    var that = this;

    var numTouches = event.touches.length;
  
    var midpointX = 0;
    var midpointY = 0;

    var scale = event.scale;
    var prevScale = scale;
    var deltaScale = scale;
  
    for(var i = 0; i < numTouches; i++) {
      this["touch" + i] = new Jester.fn.Touch(event.touches[i].pageX, event.touches[i].pageY);
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
});