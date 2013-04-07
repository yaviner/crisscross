var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'html'});
    res.end('<html><body><h1>Hello World<h1><a href="/auth/facebook">Login with Facebook</a></body></html>');
}).listen(80, '0.0.0.0');
console.log('Server running at http://0.0.0.0:80/');

var express = require('express');
var app = express();

var passport = require('passport')
, FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: '183311905150453',
    clientSecret: '78fdedcb51e0c2da92c743f51048469f',
    callbackURL: "http://0.0.0.0:80/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(function(err, user) {
        if (err) { return done(err); }
        done(null, user);
    });
}
));

app.get('/auth/facebook/', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successredirect: '/wtf',
                                           failureRedirect: '/login'}));
