define(function(require) {
  return {
    name: 'foo',
    hi: function() {
                var a = require('a');
      console.log('Hi! ' + a.name);
    }
  }
});