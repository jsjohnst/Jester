Jester.fn.extend({
  // The Touch class represents and maintains information about a single touch point on the screen.
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
});