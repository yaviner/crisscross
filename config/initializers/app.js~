var express = require('express')
, passport = require('passport')
, util = require('util')
, FacebookStrategy = require('passport-facebook').Strategy
, db = require('../../backend/dbAccess.js')
, https = require('https')
, graph = require('fbgraph')
, GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var FACEBOOK_APP_ID = "183311905150453"
var FACEBOOK_APP_SECRET = "78fdedcb51e0c2da92c743f51048469f";
var facebook_url = "https://graph.facebook.com/";

var GOOGLE_CLIENT_ID = "352371946839";
var GOOGLE_CLIENT_SECRET = "XAGcm1FrKvfXtxJJ067xB0p6";
var GOOGLE_SCOPE = "https://www.googleapis.com/auth/userinfo.calendar";
var google_url = "http://127.0.0.1:3000/auth/google/callback";


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


    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: google_url,
        passReqToCallback: true
    },
    function(req, accessToken ,refreshtoken, profile, done) {
        console.log("calling google");
        console.log(accessToken + " " + refreshtoken + " " + profile);
        function(token, tokenSecret, profile, done) {
            Account.findOne({ domain: 'google.com', uid: profile.id }, function(err, account) {
                if (err) { return done(err); }
                if (account) { return done(null, account); }

                var account = new Account();
                account.domain = 'google.com';
                account.uid = profile.id;
                var t = { kind: 'oauth', token: token, attributes: { tokenSecret: tokenSecret } };
                account.tokens.push(t);
                return done(null, account);
            });
        }
    }
    ));


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

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

