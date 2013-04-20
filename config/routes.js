// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.
var passport = require('passport');

module.exports = function routes() {
  this.root('pages#main');
  this.match('crossview', {controller: 'pages', action: 'showCrossview'});
  this.match('auth/facebook', passport.authenticate('facebook'));
  this.match('/auth/facebook/callback', 
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            console.log("routes");
            console.log(req.user);
            res.redirect('/crossview');
        });
  this.match('/auth/google',
          passport.authorize('google'));

  this.match('/auth/google/callback',
          passport.authorize('google', { failureRedirect: '/crossview' }),
          function(req, res) {
              console.log("routed");
              console.log(req.account);
              console.log(res);
              res.redirect('/crossview');
          });
}
