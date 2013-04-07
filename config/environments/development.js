var express = require('express');
var passport = require('passport');
var app = express();

module.exports = function() {
    this.use(express.errorHandler());
    this.use(express.logger());
    this.use(express.cookieParser());
    this.use(express.bodyParser());
    this.use(express.methodOverride());
    this.use(express.session({ secret: 'keyboard cat' }));
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    this.use(passport.initialize());
    this.use(passport.session());
    this.use(app.router);
}
