var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'html'});
    res.end('<html><body><h1>Hello World<h1></body></html>');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

var passport = require('passport')
, FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: '183311905150453',
    clientSecret: '78fdedcb51e0c2da92c743f51048469f',
    callbackURL: "http://127.0.0.1:1337/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function(err, user) {
        if (err) { return done(err); }
        done(null, user);
    });
}
));
