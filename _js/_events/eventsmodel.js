Jest.fn.extend({
  tap : function(func) {
    this.bind("tap", func);
  },

  doubletap : function(func) {
    this.bind("doubletap", func);
  },

  swipe : function(func) {
    this.bind("swipe", func);
  },

  flick : function(func) {
    this.bind("flick", func);
  },

  pinchnarrow : function(func) {
    this.bind("pinchnarrow", func);
  },

  pinchwiden : function(func) {
    this.bind("pinchwiden", func);
  },

  pinchend : function(func) {
    this.bind("pinchend", func);
  }
});