var locomotive = require('locomotive');
//var config = require('./config/');

var address = '0.0.0.0';
console.log("booting");
locomotive.boot(__dirname, 'development', function(err, server) {
	if (err) { throw err; }
	server.listen(3000, 'localhost', function() {
	  var addr = this.address();
	  console.log('listening on %s:%d', addr.address, addr.port);
	});
});