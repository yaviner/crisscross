var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'html'});
  res.end('<html><body><h1>Hello World<h1></body></html>');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
