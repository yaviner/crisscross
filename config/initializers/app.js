var express = require('express')
, passport = require('passport')
, util = require('util')
, FacebookStrategy = require('passport-facebook').Strategy
, db = require('../../backend/dbAccess.js')
, https = require('https')
, graph = require('fbgraph');

var FACEBOOK_APP_ID = "183311905150453"
var FACEBOOK_APP_SECRET = "78fdedcb51e0c2da92c743f51048469f";
var facebook_url = "https://graph.facebook.com/";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
module.exports = function() {
    passport.serializeUser(function(user, done) {
        console.log("serializing");
        console.log(user);
        done(null, user.user_id);
    });

    passport.deserializeUser(function(id, done) {
        console.log("deserializing");
        console.log(id);
        db.getUser(id, done);
    });


    // Use the FacebookStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Facebook
    //   profile), and invoke a callback with a user object.
    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            db.getUser(profile.id, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    console.log(user);
                    return done(null, user);
                }

                console.log(profile);
                graph.setAccessToken(accessToken);
                graph.get(profile.id+"?fields=picture", function(err, res) {
                    console.log(res); // { picture: 'http://profile.ak.fbcdn.net/'... }
                var user={ 
                    user_id: profile.id, 
                    facebook_key: accessToken, 	
                    gCalendar_key: 'gCalendarKey', 	
                    name: profile.displayName,
                    picture_url: res.picture.data.url
                }
                console.log(user);
                db.addUser(user, function() {} );
                return done(null, user);
                });
            });
        });
    })
    )};
/*
   https.get(facebook_url + profile.id + "?fields=picture&access_token=" + accessToken, function(res) {
   console.log("Got response: " + res.statusCode);
   var data='';
   res.on('data', function (chunk) {
   data+=chunk;
   });
   res.on('end', function () {
   var DataJson = JSON.parse(data);
   callback(DataJson.events);
   });
   console.log(res);
/*app.get('/account', ensureAuthenticated, function(req, res){*/
/*    res.render('account', { user: req.user });*/
/*});*/
/**/
/**/
/*// GET /auth/facebook*/
/*//   Use passport.authenticate() as route middleware to authenticate the*/
/*//   request.  The first step in Facebook authentication will involve*/
/*//   redirecting the user to facebook.com.  After authorization, Facebook will*/
/*//   redirect the user back to this application at /auth/facebook/callback*/
/*app.get('/auth/facebook',*/
/*        passport.authenticate('facebook'),*/
/*        function(req, res){*/
/*            // The request will be redirected to Facebook for authentication, so this*/
/*            // function will not be called.*/
/*        });*/
/**/
/*// GET /auth/facebook/callback*/
/*//   Use passport.authenticate() as route middleware to authenticate the*/
/*//   request.  If authentication fails, the user will be redirected back to the*/
/*//   login page.  Otherwise, the primary route function function will be called,*/
/*//   which, in this example, will redirect the user to the home page.*/
/*app.get('/auth/facebook/callback', */
/*        passport.authenticate('facebook', { failureRedirect: '/login' }),*/
/*        function(req, res) {*/
/*            res.redirect('/');*/
/*        });*/
/**/
/*app.get('/logout', function(req, res){*/
/*    req.logout();*/
/*    res.redirect('/');*/
/*});*/
/**/

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

