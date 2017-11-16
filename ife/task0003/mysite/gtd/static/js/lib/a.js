define(function(require) {
        var b = require('b');
  return {
    name: 'bar',
    hi: function() {
      console.log('Hi! ' + b.name);
    }
  }
});